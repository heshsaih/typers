package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type HandlerError struct {
	Code  int    `json:"code"`
	Error string `json:"error"`
}

func PassErrorToContext(ctx *gin.Context, code int, error string) {
	ctx.Set("ERROR", HandlerError{
		Code:  code,
		Error: error,
	})
}

func PassInternalServerErrorToContext(ctx *gin.Context) {
	PassErrorToContext(ctx, http.StatusInternalServerError, "Woopsies, thath should never happedn")
}
