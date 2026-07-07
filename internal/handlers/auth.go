package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"typers/internal/logger"
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
	log := logger.Default(ctx)
	var body LoginRequest

	if err := ctx.ShouldBindJSON(&body); err != nil {
		log.Error("invalid json", "error", err.Error())
		ctx.JSON(http.StatusBadRequest, ErrorResponse{
			Error: INVALID_BODY_MESSAGE,
		})
		return
	}

	user, err := repository.FindUserByEmail(body.Email)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		log.Error("user not found")
		ctx.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "incorrect credentials",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		log.Error("invalid credentials")
		ctx.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "incorrect credentials",
		})
		return
	}

	token, err := util.CreateJWT(user)
	if err != nil {
		log.Error("failed to sign jwt", "error", err.Error())
		ctx.JSON(http.StatusInternalServerError, ErrorResponse{
			Error: INTERNAL_SERVER_ERROR_MESSAGE,
		})
		return
	}

	ctx.Header("Authorization", fmt.Sprintf("Bearer %v", token))
	ctx.JSON(http.StatusOK, "")
}

func HandleSignIn(ctx *gin.Context) {
	var body SignInRequest
	log := logger.Default(ctx)

	if err := ctx.ShouldBindJSON(&body); err != nil {
		log.Error("invalid json", "error", err.Error())
		ctx.JSON(http.StatusBadRequest, ErrorResponse{
			Error: INVALID_BODY_MESSAGE,
		})
		return
	}

	user, err := repository.FindUserByUsernameOrEmail(body.Username, body.Email)
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Error("user already exists")
		ctx.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "username or email taken",
		})
		return
	}

	user = &repository.User{
		Username: body.Username,
		Email:    body.Email,
		Role:     repository.USER_ROLE_USER,
	}

	if hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost); err != nil {
		log.Error("failed to hash password", "error", err.Error())
		ctx.JSON(http.StatusInternalServerError, ErrorResponse{
			Error: INTERNAL_SERVER_ERROR_MESSAGE,
		})
		return
	} else {
		user.Password = string(hash)
	}

	if err := repository.SaveUser(user); err != nil {
		log.Error("failed to save user", "error", err.Error())
		ctx.JSON(http.StatusInternalServerError, ErrorResponse{
			Error: INTERNAL_SERVER_ERROR_MESSAGE,
		})
		return
	}

	if jwt, err := util.CreateJWT(user); err != nil {
		log.Error("failed to create jwt", "error", err.Error())
		ctx.JSON(http.StatusInternalServerError, ErrorResponse{
			Error: INTERNAL_SERVER_ERROR_MESSAGE,
		})
	} else {
		ctx.Header("Authorization", fmt.Sprintf("Bearer %v", jwt))
	}

	ctx.JSON(http.StatusOK, "")
}
