package handlers

import (
	"net/http"
	"strconv"
	"typers/internal/service"

	"github.com/gin-gonic/gin"
)

const DEFAULT_AMOUNT = 50

type GetWordsResponse struct {
	Words []string `json:"words"`
}

func HandleGetWords(ctx *gin.Context) {
	amount := parseAmount(ctx.GetQuery("amount"))
	words := service.GetWords(amount)
	ctx.JSON(http.StatusOK, GetWordsResponse{words})
}

func parseAmount(param string, ok bool) int {
	if !ok {
		return DEFAULT_AMOUNT
	}

	amount, err := strconv.Atoi(param)
	if err != nil {
		return DEFAULT_AMOUNT
	}

	return amount
}
