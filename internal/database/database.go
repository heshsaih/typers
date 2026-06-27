package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DatabseConnectionConfig struct {
	Host         string
	Port         int
	User         string
	Password     string
	DatabaseName string
}

var database *gorm.DB = nil

func Connect(cfg DatabseConnectionConfig) {
	if database != nil {
		log.Fatal("the app is already connected to a db, this should never happen")
	}

	dsn := fmt.Sprintf("host=%v user=%v password=%v dbname=%v port=%v sslmode=disable TimeZone=Europe/Warsaw", cfg.Host, cfg.User, cfg.Password, cfg.DatabaseName, cfg.Port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		TranslateError: true,
	})
	if err != nil {
		log.Fatal("failed to connect to the db", err)
	}

	log.Println("connection to the db established")
	database = db
}

func GetConnection() *gorm.DB {
	if database == nil {
		log.Fatal("no db connection")
	}

	return database
}
