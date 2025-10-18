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

	defaultGroup := router.Group("/api/v1")

	//auth
	defaultGroup.POST("/auth/register", handlers.HandleRegister)
	defaultGroup.POST("/auth/login", handlers.HandleLogin)
	defaultGroup.GET("/typing/words", handlers.HandleGetWords)
	defaultGroup.GET("/typing", handlers.HandleSession)

	//guarded
	guardedGroup := defaultGroup.Group("/")
	guardedGroup.GET("/foo123", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"bar": "buzz",
		})
	})

	router.Use(middlewares.CORSMiddleware)
	router.Use(middlewares.RetrieveAuthenticationMiddleware)
	guardedGroup.Use(middlewares.AuthenticatedMiddleware)

	router.RunTLS(":42069", "server.crt", "server.key")
}
