package handlers

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strconv"
	"strings"
	cryptograpy "typers/internal/cryptography"
	"typers/internal/database"
	"typers/internal/enums"
	"typers/internal/model"
	"typers/internal/services"
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
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": enums.ERR_INTERNAL_SERVER_ERROR,
		})
		return
	}
	defer conn.Close()

	_, message, err := conn.ReadMessage()
	if err != nil {
		return
	}

	splitToken := strings.Split(string(message), " ")
	if len(splitToken) != 2 {
		conn.WriteMessage(1003, []byte(enums.ERR_INVALID_TOKEN))
		return
	}

	var session *model.Session = nil

	token, err := cryptograpy.ParseToken(splitToken[1])
	if err != nil {
		log.Println("User is anonymous, continuing")
	} else {
		subject, err := token.Claims.GetSubject()
		if err != nil {
			conn.WriteMessage(1003, []byte(enums.ERR_INVALID_TOKEN))
			return
		}
		log.Println("User: ", subject)

		user := model.User{}
		if err := database.Database.Where("username = ?", subject).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				conn.WriteMessage(1003, []byte(enums.ERR_USER_NOT_FOUND))
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
				conn.WriteMessage(1003, []byte(enums.ERR_OPEN_SESSION))
				return
			}
			conn.WriteMessage(1011, []byte(enums.ERR_INTERNAL_SERVER_ERROR))
			return
		}
	}

	defer func() {
		if session != nil {
			session.Active = false
			database.Database.Save(session)
		}
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			return
		}

		log.Println("Retrieved message: ", string(message))

		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			return
		}
	}
}
