package services

import (
	"errors"
	"log"
	cryptograpy "typers/internal/cryptography"
	"typers/internal/database"
	"typers/internal/enums"
	"typers/internal/model"

	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type SessionMessageType string

const (
	AUTH              SessionMessageType = "AUTH"
	WORD              SessionMessageType = "WORD"
	INVALID_HANDSHAKE SessionMessageType = "INVALID_HANDSHAKE"
)

const USER_UNAUTHENTICATED = "UNAUTHENTICATED"

type SessionMessage struct {
	MessageType SessionMessageType `json:"messageType"`
	Data        any                `json:"data"`
}

func InvalidateSessions() error {
	log.Println("[InvalidateSessions] Invalidating session on app start...")
	var sessions []*model.Session
	if result := database.Database.Where("active = 't'").Find(&sessions); result.Error != nil {
		return result.Error
	}
	log.Println("[InvalidateSessions]", len(sessions), "sessions found for invalidation")
	if len(sessions) == 0 {
		log.Println("[InvalidateSessions] No active sessions, returning")
		return nil
	}

	for _, session := range sessions {
		session.Active = false
	}

	if result := database.Database.Save(sessions); result.Error != nil {
		return result.Error
	}

	log.Println("[InvalidateSessions] Invalidated", len(sessions), "sessions successfully")

	return nil
}

func InitialSessionHandshake(conn *websocket.Conn) (*model.Session, error) {
	authMessage := SessionMessage{}
	if err := conn.ReadJSON(&authMessage); err != nil {
		return nil, err
	}
	log.Println("[InitialSessionHandshake] Body retrieved")

	if authMessage.MessageType != AUTH {
		response := SessionMessage{
			MessageType: INVALID_HANDSHAKE,
			Data:        nil,
		}
		if err := conn.WriteJSON(response); err != nil {
			return nil, err
		}
		return nil, errors.New(string(enums.ERR_INVALID_HANDSHAKE))
	}
	log.Println("[InitialSessionHandshake] Correct message type")

	tokenAsString, ok := authMessage.Data.(string)
	if !ok {
		response := SessionMessage{
			MessageType: SessionMessageType(enums.ERR_INVALID_TOKEN),
			Data:        nil,
		}
		conn.WriteJSON(&response)
		return nil, errors.New(string(enums.ERR_INVALID_TOKEN))
	}

	log.Println("[InitialSessionHandshake] Properly casted")

	if tokenAsString == USER_UNAUTHENTICATED {
		return nil, nil
	}


	parsedToken, err := cryptograpy.ParseToken(tokenAsString)
	if err != nil {
		response := SessionMessage{
			MessageType: SessionMessageType(enums.ERR_INVALID_TOKEN),
			Data:        nil,
		}
		if err := conn.WriteJSON(&response); err != nil {
			return nil, err
		}
		return nil, err
	}

	log.Println("[InitialSessionHandshake] Properly parsed")

	subject, err := parsedToken.Claims.GetSubject()
	if err != nil {
		response := SessionMessage{
			MessageType: SessionMessageType(enums.ERR_INVALID_TOKEN),
			Data:        nil,
		}
		if err := conn.WriteJSON(&response); err != nil {
			return nil, err
		}
		return nil, err
	}

	user := model.User{}
	if err := database.Database.Where("username = ?", subject).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			conn.WriteMessage(1003, []byte(enums.ERR_USER_NOT_FOUND))
		}
		return nil, err
	}

	session, err := createNewSession(user.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			conn.WriteMessage(1003, []byte(enums.ERR_OPEN_SESSION))
		}
		return nil, err
	}

	return session, nil
}

func createNewSession(userID uint) (*model.Session, error) {
	session := &model.Session{
		UserID: userID,
		Active: true,
	}

	if err := database.Database.Create(session).Error; err != nil {
		return nil, err
	}

	return session, nil
}
