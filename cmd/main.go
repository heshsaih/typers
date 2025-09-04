package main

import (
	"typers/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/ping", handlers.HandlePing)

	router.Run()
}
