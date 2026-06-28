package handlers

import (
	"fmt"
	"log"
	"net/http"
	"typers/internal/repository"
	"typers/internal/util"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid json",
		})
		return
	}

	user := repository.FindUserByEmail(body.Email)
	if user == nil {
		log.Printf("user %v not found", body)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		log.Printf("invalid password, error: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid password",
		})
		return
	}

	token, err := util.CreateJWT(user)
	if err != nil {
		log.Printf("failed to sign jwt, error: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to sign jwt",
		})
		return
	}

	ctx.Header("Authorization", fmt.Sprintf("Bearer %v", token))
	ctx.JSON(http.StatusOK, nil)
}

func HandleSignIn(ctx *gin.Context) {
	var body SignInRequest

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, "invalid json")
		return
	}

	log.Println(body)

	user := repository.FindUserByUsernameAndEmail(body.Username, body.Email)
	if user != nil {
		ctx.JSON(http.StatusBadRequest, "user with this username or email already exists")
		return
	}

	user = &repository.User{
		Username: body.Username,
		Email:    body.Email,
		Role:     repository.USER_ROLE_USER,
	}

	if hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost); err != nil {
		ctx.JSON(http.StatusInternalServerError, "woopsies :33")
		return
	} else {
		user.Password = string(hash)
	}

	repository.SaveUser(user)
	ctx.JSON(http.StatusOK, "bomba")
}
