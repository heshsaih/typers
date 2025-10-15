package middlewares

import (
	"net/http"
	"strings"
	cryptograpy "typers/internal/cryptography"

	"github.com/gin-gonic/gin"
)

func AuthenticatedMiddleware(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")

	if len(authHeader) == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "authentication required",
		})
		c.Abort()
		return
	}

	splitHeader := strings.Split(authHeader, " ")
	if len(splitHeader) < 2 || (len(splitHeader) > 0 && splitHeader[0] != "Bearer") {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid authentication header",
		})
		c.Abort()
		return
	}

	if cryptograpy.VerifyToken(splitHeader[1]) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid authentication token",
		})
		c.Abort()
		return
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
