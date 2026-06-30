package handlers

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"typers/internal/repository"
	"typers/internal/util"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=32"`
}

type LoginResponse struct {
	error string
}

type SignInRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Username string `json:"username" binding:"required,min=5,max=32"`
	Password string `json:"password" binding:"required,min=8,max=32"`
}

type SignInResponse struct {
	error string
}

func HandleLogin(ctx *gin.Context) {
	var body LoginRequest

	if err := ctx.ShouldBindJSON(&body); err != nil {
		log.Printf("failed to login %v, error: %v", body, err)
		ctx.JSON(http.StatusBadRequest, LoginResponse{
			error: "invalid body",
		})
		return
	}

	user, err := repository.FindUserByEmail(body.Email)
	if err == nil {
		log.Printf("user %v not found", body)
		ctx.JSON(http.StatusBadRequest, LoginResponse{
			error: "user not found",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		log.Printf("invalid password, error: %v", err)
		ctx.JSON(http.StatusBadRequest, LoginResponse{
			error: "invalid password",
		})
		return
	}

	token, err := util.CreateJWT(user)
	if err != nil {
		log.Printf("failed to sign jwt, error: %v", err)
		ctx.JSON(http.StatusInternalServerError, LoginResponse{
			error: "internal server error",
		})
		return
	}

	ctx.Header("Authorization", fmt.Sprintf("Bearer %v", token))
	ctx.JSON(http.StatusOK, LoginResponse{
		error: "",
	})
}

func HandleSignIn(ctx *gin.Context) {
	var body SignInRequest

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, SignInResponse{
			error: "invalid json",
		})
		return
	}

	user, err := repository.FindUserByUsernameAndEmail(body.Username, body.Email)
	if err == nil || !errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(http.StatusBadRequest, SignInResponse{
			error: "user already exists",
		})
		return
	}

	user = &repository.User{
		Username: body.Username,
		Email:    body.Email,
		Role:     repository.USER_ROLE_USER,
	}

	if hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost); err != nil {
		ctx.JSON(http.StatusInternalServerError, SignInResponse{
			error: "internal server error",
		})
		return
	} else {
		user.Password = string(hash)
	}

	repository.SaveUser(user)
	ctx.JSON(http.StatusOK, SignInResponse{
		error: "",
	})
}
