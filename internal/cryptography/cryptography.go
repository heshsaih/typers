package cryptograpy

import (
	"fmt"
	"os"
	"time"
	"typers/internal/model"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func CreateToken(user *model.User) (string, error) {
	secret := []byte(os.Getenv("CRYPTO_SECRET"))
	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.Username,
		"role": user.Role,
		"iat":  now.Unix(),
		"exp":  now.Add(time.Hour * 3).Unix(),
		"iss":  "typers",
	})

	signedToken, err := token.SignedString(secret)

	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func ParseToken(signedToken string) (token *jwt.Token, error1 error) {
	token, err := jwt.Parse(signedToken, func(token *jwt.Token) (any, error) {
		return []byte(os.Getenv("CRYPTO_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return token, nil
}

func HashPassword(plainPassword string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(plainPassword), 14)
	return string(bytes), err
}

func ComparePasswords(hashedPassword string, plainPassword string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword)) == nil
}
