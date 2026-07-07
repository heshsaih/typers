package logger

import (
	"log/slog"
	"github.com/gin-gonic/gin"
)

func Default(ctx *gin.Context) *slog.Logger {
	if ctx == nil {
		return slog.Default()
	}

	if id, ok := ctx.Get("requestId"); ok {
		return slog.With("requestId", id)
	}

	return slog.Default()
}
