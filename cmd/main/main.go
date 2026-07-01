package main

import (
	"log"
	"os"
	"strconv"
	"typers/internal/database"
	"typers/internal/handlers"
	"typers/internal/middleware"
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

	databaseCfg := database.DatabseConnectionConfig{
		Host:         os.Getenv("DB_HOST"),
		User:         os.Getenv("DB_USERNAME"),
		Password:     os.Getenv("DB_PASSWORD"),
		DatabaseName: os.Getenv("DB_NAME"),
	}
	if dbPort, err := strconv.Atoi(os.Getenv("DB_PORT")); err != nil {
		log.Fatal("failed to parse database port from env")
	} else {
		databaseCfg.Port = dbPort
	}

	database.Connect(databaseCfg)

	router := gin.Default()
	router.Use(middleware.HandleError)
	router.Use(cors.New(cors.Config{
		AllowMethods:     []string{"POST, GET, PUT, PATCH, OPTIONS"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Authorization", "Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		AllowAllOrigins:  true,
	}))
	v1 := router.Group("/api/v1")

	//auth
	v1.POST("/auth/signin", handlers.HandleSignIn)
	v1.POST("/auth/login", handlers.HandleLogin)

	//words
	v1.GET("/words", handlers.HandleGetWords)
	router.RunTLS(":42069", "server.crt", "server.key")
}
