package repository

import (
	"context"
	"typers/internal/database"
	"gorm.io/gorm"
)

type UserRole string

const (
	USER_ROLE_USER  UserRole = "user"
	USER_ROLE_ADMIN UserRole = "admin"
)

type User struct {
	gorm.Model
	Username string   `gorm:"uniqueIndex,required"`
	Email    string   `gorm:"uniqueIndex,required"`
	Password string   `gorm:"required"`
	Role     UserRole `gorm:"required"`
}

func FindUserByEmail(email string) *User {
	user, _ := gorm.G[User](database.GetConnection()).Where("email = ?", email).First(context.Background())
	return &user
}

func FindUserByUsernameAndEmail(username string, email string) *User {
	user, _ := gorm.G[User](database.GetConnection()).Where("username = ? and email = ?", username, email).First(context.Background())
	return &user
}

func SaveUser(user *User) error {
	return gorm.G[User](database.GetConnection()).Create(context.Background(), user)
}
