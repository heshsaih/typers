package handlers

import (
	"errors"
	"fmt"
	"net/http"
	cryptograpy "typers/internal/cryptography"
	"typers/internal/database"
	"typers/internal/enums"
	"typers/internal/model"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"gorm.io/gorm"
)

func HandleRegister(c *gin.Context) {
	var requestBody struct {
		Username string `json:"username" binding:"required,min=4"`
		Password string `json:"password" binding:"required,min=8"`
	}

	if err := c.ShouldBindBodyWith(&requestBody, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": enums.ERR_INVALID_BODY,
		})
		return
	}

	hashedPassword, err := cryptograpy.HashPassword(requestBody.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": enums.ERR_INVALID_BODY,
		})
		return
	}

	newUser := model.User{
		Username: requestBody.Username,
		Password: hashedPassword,
		Role:     enums.ROLE_USER,
	}

	if err := database.Database.Create(&newUser).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": enums.ERR_USERNAME_TAKEN,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": enums.ERR_INTERNAL_SERVER_ERROR,
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
			"error": enums.ERR_INVALID_BODY,
		})
		return
	}

	var user *model.User
	if err := database.Database.Where("username = ?", requestBody.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": enums.ERR_INVALID_PASSWORD,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": enums.ERR_INTERNAL_SERVER_ERROR,
		})
		return
	}

	if !cryptograpy.ComparePasswords(user.Password, requestBody.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": enums.ERR_INVALID_PASSWORD,
		})
		return
	}

	token, err := cryptograpy.CreateToken(user)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": enums.ERR_INVALID_PASSWORD,
		})
		return
	}

	c.Header("Authorization", fmt.Sprintf("Bearer %s", token))
	c.JSON(http.StatusOK, gin.H{})
}
