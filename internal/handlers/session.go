package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"strconv"
	"typers/internal/database"
	"typers/internal/enums"
	"typers/internal/services"
)

const (
	WORDS_PROVIDER_UNAVAILABLE = "WORDS_PROVIDER_UNAVAILABLE"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleGetWords(c *gin.Context) {
	var amount int
	if result, err := strconv.Atoi(c.Query("amount")); err != nil {
		log.Println("Failed to parse the \"amount\" parameter, defaulting to 30")
		amount = 30
	} else {
		amount = result
	}

	words, err := services.GetWords(amount)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": WORDS_PROVIDER_UNAVAILABLE,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"words": words,
	})
}

func HandleSession(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": enums.ERR_INTERNAL_SERVER_ERROR,
		})
		return
	}
	defer conn.Close()

	session, err := services.InitialSessionHandshake(conn)
	if err != nil {
		log.Println("[HandleSession] Handshake failed due to:", err.Error())
		return
	}

	if session != nil {
		log.Println("[HandleSession] User is authenticated, user id:", session.UserID)
	} else {
		log.Println("[HandleSession] User is anonymous")
	}

	defer func() {
		if session != nil {
			session.Active = false
			database.Database.Save(session)
		}
	}()

	services.SessionLoop(conn)
}
