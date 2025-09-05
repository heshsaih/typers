package handlers

import (
	"errors"
	"fmt"
	"net/http"
	cryptograpy "typers/internal/cryptography"
	"typers/internal/database"
	"typers/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleRegister(c *gin.Context) {
	var requestBody struct {
		Username string `json:"username" binding:"required,min=4"`
		Password string `json:"password" binding:"required,min=8"`
	}

	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	hashedPassword, err := cryptograpy.HashPassword(requestBody.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	newUser := model.User{
		Username: requestBody.Username,
		Password: hashedPassword,
		Role:     model.USER_ROLE,
	}

	if err := database.Database.Create(&newUser).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "user already exists",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func HandleLogin(c *gin.Context) {
	var requestBody struct {
		Username string `json:"username" binding:"required,min=4"`
		Password string `json:"password" binding:"required,min=8"`
	}

	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var user *model.User
	if err := database.Database.Where("username = ?", requestBody.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "user not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
		return
	}

	if !cryptograpy.ComparePasswords(user.Password, requestBody.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid password",
		})
		return
	}

	token, err := cryptograpy.CreateToken(user)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.Header("Authorization", fmt.Sprintf("Bearer %s", token))
	c.JSON(http.StatusOK, gin.H{})
}
