package util

import (
	"os"
	"time"
	"typers/internal/repository"

	"github.com/golang-jwt/jwt/v5"
)

func CreateJWT(user *repository.User) (string, error) {
	claims := jwt.MapClaims{}
	claims["iss"] = "typers"
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(24)).Unix()
	claims["user"] = user.Username
	claims["role"] = user.Role

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
