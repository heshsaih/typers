package main

import (
	"log"
	"typers/internal/handlers"
	"typers/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("failed to load env: ", err)
	}

	service.LoadWords()

	router := gin.Default()
	router.Use(cors.Default())
	v1 := router.Group("/api/v1")

	//words
	v1.GET("/words", handlers.HandleGetWords)

	router.RunTLS(":42069", "server.crt", "server.key")
}
