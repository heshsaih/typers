package middleware

import (
	"log"
	"typers/internal/util"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func HandleError(ctx *gin.Context) {
	ctx.Next()

	err, ok := ctx.Get("ERROR")
	if !ok {
		return
	}

	cast, ok := err.(util.HandlerError)
	if !ok {
		log.Printf("there is an error, but cant be casted to a type. value: %v. ignoring", err)
		return
	}

	ctx.JSON(cast.Code, ErrorResponse{
		Error: cast.Error,
	})
}
