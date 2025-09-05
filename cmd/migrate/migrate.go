package main

import (
	"log"
	"typers/internal/database"
	"typers/internal/model"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalln("Couldn't load .env file")
		panic(err)
	}
	
	database.ConnectToDatabase()

	database.Database.AutoMigrate(&model.User{})
}
