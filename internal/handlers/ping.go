package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	cryptograpy "typers/internal/cryptography"

	"github.com/gin-gonic/gin"
)

func HandlePing(c *gin.Context) {
	token, err := cryptograpy.CreateToken(c.Param("username"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
		return
	}

	c.Header("Authorization", fmt.Sprintf("Bearer %s", token))
}

func HandlePong(c *gin.Context) {
	authHeader := c.Request.Header["Authorization"]
	log.Println(authHeader)

	if len(authHeader) == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{})
		return
	}

	token := strings.Split(authHeader[0], " ")

	if len(token) < 2 {
		c.JSON(http.StatusUnauthorized, gin.H{})
		return
	}

	jwt := token[1]

	if err := cryptograpy.VerifyToken(jwt); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}
