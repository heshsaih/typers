package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"typers/internal/service"
)

const defaultAmount = 50

type getWordsResponse struct {
	Words []string `json:"words"`
}

func HandleGetWords(ctx *gin.Context) {
	amount := parseAmount(ctx.GetQuery("amount"))
	words := service.GetWords(amount)
	ctx.JSON(http.StatusOK, getWordsResponse{words})
}

func parseAmount(param string, ok bool) int {
	if !ok {
		return defaultAmount
	}

	amount, err := strconv.Atoi(param)
	if err != nil {
		return defaultAmount
	}

	return amount
}
