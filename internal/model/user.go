package model

import (
	"gorm.io/gorm"
	"typers/internal/enums"
)

type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex"`
	Password string
	Role     enums.Role
}
