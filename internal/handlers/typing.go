package handlers

import (
	"log"
	"net/http"
	"strconv"
	"typers/internal/services"

	"github.com/gin-gonic/gin"
)

func HandleGetWords(c *gin.Context) {
	var amount int
	if result, err := strconv.Atoi(c.Query("amount")); err != nil {
		log.Println("Failed to parse the \"amount\" parameter, defaulting to 30")
		amount = 30
	} else {
		amount = result
	}

	words, err := services.GetWords(amount)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"words": words,
	})
}
