package middleware

import (
	"time"
	"typers/internal/logger"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func LogRequestMiddleware(ctx *gin.Context) {
	requestId := uuid.New().String()
	ctx.Set("requestId", requestId)
	ctx.Header("X-Request-Id", requestId)

	start := time.Now()
	log := logger.Default(ctx)
	log.Info("received request: ", "path", ctx.FullPath())

	ctx.Next()

	end := time.Since(start)

	log.Info("request finished", "time", end.String())
}
