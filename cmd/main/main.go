package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"typers/internal/database"
	"typers/internal/handlers"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalln("Couldn't load .env file")
		panic(err)
	}

	database.ConnectToDatabase()

	router := gin.Default()
	router.GET("/ping/:username", handlers.HandlePing)
	router.GET("/pong", handlers.HandlePong)

	router.Run()
}
