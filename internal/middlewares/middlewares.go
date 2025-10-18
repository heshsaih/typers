package middlewares

import (
	"log"
	"net/http"
	"strings"
	cryptograpy "typers/internal/cryptography"
	"typers/internal/enums"

	"github.com/gin-gonic/gin"
)

func AuthenticatedMiddleware(c *gin.Context) {
	_, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": enums.ERR_ACCESS_DENIED,
		})
		c.Abort()
	}

	c.Next()
}

func CORSMiddleware(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Writer.Header().Set("Access-Control-Expose-Headers", "Authorization")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(204)
		return
	}

	c.Next()
}

func RetrieveAuthenticationMiddleware(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")

	if len(authHeader) == 0 {
		c.Next()
		return
	}

	splitHeader := strings.Split(authHeader, " ")
	if len(splitHeader) < 2 || (len(splitHeader) > 0 && splitHeader[0] != "Bearer") {
		c.Next()
		return
	}

	token, err := cryptograpy.ParseToken(splitHeader[1])
	if err != nil {
		c.Next()
		return
	}

	if subject, err := token.Claims.GetSubject(); err != nil {
		c.Next()
		return
	} else {
		c.Set("user", subject)
		log.Println("retrieved authentication for: {}", subject)
	}

	c.Next()
}
