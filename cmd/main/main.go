package main

import (
	"log"
	"net/http"
	"typers/internal/database"
	"typers/internal/handlers"
	"typers/internal/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalln("Couldn't load .env file")
		panic(err)
	}

	database.ConnectToDatabase()

	router := gin.Default()
	router.Use(middlewares.CORSMiddleware)

	defaultGroup := router.Group("/api/v1")

	//auth
	defaultGroup.POST("/auth/register", handlers.HandleRegister)
	defaultGroup.POST("/auth/login", handlers.HandleLogin)

	//guarded
	guardedGroup := defaultGroup.Group("/")
	guardedGroup.Use(middlewares.AuthenticatedMiddleware)
	guardedGroup.GET("/foo123", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"bar": "buzz",
		})
	})

	router.Run()
}
