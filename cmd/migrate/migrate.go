package main

import (
	"log"
	"os"
	"strconv"
	"typers/internal/database"
	"typers/internal/repository"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("failed to load env: ", err)
	}

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
	db := database.GetConnection()
	db.AutoMigrate(&repository.User{})
}
