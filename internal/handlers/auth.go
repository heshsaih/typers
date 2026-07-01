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

type SignInRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Username string `json:"username" binding:"required,min=5,max=32"`
	Password string `json:"password" binding:"required,min=8,max=32"`
}

func HandleLogin(ctx *gin.Context) {
	var body LoginRequest

	if err := ctx.ShouldBindJSON(&body); err != nil {
		log.Printf("failed to login %v, error: %v", body, err)
		util.PassErrorToContext(ctx, http.StatusBadRequest, "Invalid JSON")
		return
	}

	user, err := repository.FindUserByEmail(body.Email)
	if errors.Is(err, gorm.ErrRecordNotFound)  {
		log.Printf("user %v not found", body)
		util.PassErrorToContext(ctx, http.StatusBadRequest, "User not found")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		log.Printf("invalid password, error: %v", err)
		util.PassErrorToContext(ctx, http.StatusBadRequest, "Password was incorrect")
		return
	}

	token, err := util.CreateJWT(user)
	if err != nil {
		log.Printf("failed to sign jwt, error: %v", err)
		util.PassInternalServerErrorToContext(ctx)
		return
	}

	ctx.Header("Authorization", fmt.Sprintf("Bearer %v", token))
	ctx.JSON(http.StatusOK, "")
}

func HandleSignIn(ctx *gin.Context) {
	var body SignInRequest

	if err := ctx.ShouldBindJSON(&body); err != nil {
		util.PassErrorToContext(ctx, http.StatusBadRequest, "Invalid JSON")
		return
	}

	user, err := repository.FindUserByUsernameAndEmail(body.Username, body.Email)
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		util.PassErrorToContext(ctx, http.StatusBadRequest, "This email/username is already taken")
		return
	}

	user = &repository.User{
		Username: body.Username,
		Email:    body.Email,
		Role:     repository.USER_ROLE_USER,
	}

	if hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost); err != nil {
		util.PassInternalServerErrorToContext(ctx)
		return
	} else {
		user.Password = string(hash)
	}

	if err := repository.SaveUser(user); err != nil {
		util.PassInternalServerErrorToContext(ctx)
		return
	}

	if jwt, err := util.CreateJWT(user); err != nil {
		util.PassInternalServerErrorToContext(ctx)
		return
	} else {
		ctx.Header("Authorization", fmt.Sprintf("Bearer %v", jwt))
	}

	ctx.JSON(http.StatusOK, "")
}
