package main

import (
	"log"
	"net/http"
	"typers/internal/database"
	"typers/internal/handlers"
	"typers/internal/middlewares"
	"typers/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalln("Couldn't load .env file")
		panic(err)
	}

	database.ConnectToDatabase()

	services.InvalidateSessions()

	router := gin.Default()
	router.Use(middlewares.CORSMiddleware)
	router.Use(middlewares.RetrieveAuthenticationMiddleware)

	defaultGroup := router.Group("/api/v1")

	//auth
	defaultGroup.POST("/auth/register", handlers.HandleRegister)
	defaultGroup.POST("/auth/login", handlers.HandleLogin)
	defaultGroup.GET("/typing/words", handlers.HandleGetWords)

	//guarded
	guardedGroup := defaultGroup.Group("/")
	guardedGroup.Use(middlewares.AuthenticatedMiddleware)
	guardedGroup.GET("/foo123", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"bar": "buzz",
		})
	})


	router.RunTLS(":42069", "server.crt", "server.key")
}
