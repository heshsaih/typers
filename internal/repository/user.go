package repository

import (
	"context"
	"gorm.io/gorm"
	"typers/internal/database"
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

func FindUserByEmail(email string) (*User, error) {
	user, err := gorm.G[User](database.GetConnection()).Where("email = ?", email).First(context.Background())
	return &user, err
}

func FindUserByUsernameOrEmail(username string, email string) (*User, error) {
	user, err := gorm.G[User](database.GetConnection()).Where("username = ? or email = ?", username, email).First(context.Background())
	return &user, err
}

func SaveUser(user *User) error {
	return gorm.G[User](database.GetConnection()).Create(context.Background(), user)
}
