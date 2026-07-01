package util

import (
	"os"
	"time"
	"typers/internal/repository"

	"github.com/golang-jwt/jwt/v5"
)

func CreateJWT(user *repository.User) (string, error) {
	now := time.Now()
	claims := jwt.MapClaims{}
	claims["iss"] = "typers"
	claims["iat"] = now.Unix()
	claims["exp"] = now.Add(time.Hour * time.Duration(24)).Unix()
	claims["sub"] = user.Username
	claims["role"] = user.Role

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
