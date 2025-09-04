package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DatabaseConfig struct {
	username string
	password string
	host     string
	port     string
	database string
}

var Database *gorm.DB = nil

func loadConfig() DatabaseConfig {
	if err := godotenv.Load(); err != nil {
		log.Fatalln("Couldn't load .env file")
		panic(err)
	}

	return DatabaseConfig{
		username: os.Getenv("POSTGRES_USERNAME"),
		password: os.Getenv("POSTGRES_PASSWORD"),
		database: os.Getenv("POSTGRES_DB"),
		host:     os.Getenv("POSTGRES_HOST"),
		port:     os.Getenv("POSTGRES_PORT"),
	}
}

func ConnectToDatabase() {
	config := loadConfig()

	dsn := fmt.Sprintf("user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Warsaw", config.username, config.password, config.database, config.port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalln("Failed to connect to the database")
		panic(err)
	}

	log.Println("Connection to the database established")
	Database = db
}
