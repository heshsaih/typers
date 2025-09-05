package cryptograpy

import (
	"crypto/sha256"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func CreateToken(username string) (string, error) {
	secret := []byte(os.Getenv("CRYPTO_SECRET"))
	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": username,
		"iat": now.Unix(),
		"exp": now.Add(time.Hour * 3).Unix(),
		"iss": "typers",
	})

	signedToken, err := token.SignedString(secret)

	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func VerifyToken(signedToken string) error {
	token, err := jwt.Parse(signedToken, func(token *jwt.Token) (any, error) {
		return []byte(os.Getenv("CRYPTO_SECRET")), nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}

func HashPassword(plainPassword string) string {
	hash := sha256.New()
	hash.Write([]byte(plainPassword))
	return string(hash.Sum(nil))
}

func ComparePasswords(password string, hashedPassword string) bool {
	hash := sha256.New()
	hash.Write([]byte(password))
	result := string(hash.Sum(nil))

	return result == hashedPassword
}
