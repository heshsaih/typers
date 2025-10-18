package handlers

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"typers/internal/database"
	"typers/internal/enums"
	"typers/internal/model"
	"typers/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
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
			"error": "",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"words": words,
	})
}

func HandleSession(c *gin.Context) {
	username, exists := c.Get("user")
	var session *model.Session

	if exists {
		user := model.User{}
		if err := database.Database.Where("username = ?", username).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusNotFound, gin.H{
					"error": enums.ERR_USER_NOT_FOUND,
				})
				return
			}
		}

		session = &model.Session{
			UserID: user.ID,
			Active: true,
		}

		if err := database.Database.Create(session).Error; err != nil {
			log.Println(err)
			if errors.Is(err, gorm.ErrDuplicatedKey) {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": enums.ERR_OPEN_SESSION,
				})
				return
			}
		}
	}

	log.Println("before upgrader")

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": enums.ERR_INTERNAL_SERVER_ERROR,
		})
		return
	}

	log.Println("after upgrader")

	defer func() {
		conn.Close()
		if session != nil {
			session.Active = false
			database.Database.Delete(session)
		}
	}()

	for {
		log.Println("reading...")
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error: failed to read message")
			return
		}

		log.Println("Retrieved message: ", string(message))

		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println("Error: failed to write message")
			return
		}
	}
}
