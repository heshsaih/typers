package main

import (
	database "typers/internal"
	"typers/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectToDatabase()

	router := gin.Default()

	router.GET("/ping", handlers.HandlePing)

	router.Run()
}
