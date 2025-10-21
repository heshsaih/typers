package services

import (
	"errors"
	"github.com/gorilla/websocket"
	"log"
	cryptograpy "typers/internal/cryptography"
	"typers/internal/database"
	"typers/internal/enums"
	"typers/internal/model"
)

type SessionMessageType string

const (
	AUTH  SessionMessageType = "AUTH"
	INIT  SessionMessageType = "INIT"
	ERROR SessionMessageType = "ERROR"
	ACK   SessionMessageType = "ACK"
)

const (
	INVALID_HANDSHAKE     = "INVALID_HANDSHAKE"
	INVALID_TOKEN         = "INVALID_TOKEN"
	OPEN_SESSION          = "OPEN_SESSION"
	INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
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

	if authMessage.MessageType != AUTH {
		response := SessionMessage{
			MessageType: ERROR,
			Data:        INVALID_HANDSHAKE,
		}
		if err := conn.WriteJSON(response); err != nil {
			return nil, err
		}
		return nil, errors.New(string(enums.ERR_INVALID_HANDSHAKE))
	}

	tokenAsString, ok := authMessage.Data.(string)
	if !ok {
		response := SessionMessage{
			MessageType: ERROR,
			Data:        INVALID_TOKEN,
		}
		conn.WriteJSON(&response)
		return nil, errors.New(string(enums.ERR_INVALID_TOKEN))
	}

	if tokenAsString == USER_UNAUTHENTICATED {
		return nil, nil
	}

	parsedToken, err := cryptograpy.ParseToken(tokenAsString)
	if err != nil {
		response := SessionMessage{
			MessageType: ERROR,
			Data:        INVALID_TOKEN,
		}
		if err := conn.WriteJSON(&response); err != nil {
			return nil, err
		}
		return nil, err
	}

	subject, err := parsedToken.Claims.GetSubject()
	if err != nil {
		response := SessionMessage{
			MessageType: ERROR,
			Data:        INVALID_TOKEN,
		}
		if err := conn.WriteJSON(&response); err != nil {
			return nil, err
		}
		return nil, err
	}

	user := model.User{}
	if err := database.Database.Where("username = ?", subject).First(&user).Error; err != nil {
		response := SessionMessage{
			MessageType: ERROR,
			Data:        INVALID_TOKEN,
		}
		if err := conn.WriteJSON(&response); err != nil {
			return nil, err
		}
		return nil, err
	}

	session, err := createNewSession(user.ID)
	if err != nil {
		response := SessionMessage{
			MessageType: ERROR,
			Data:        OPEN_SESSION,
		}
		if err := conn.WriteJSON(&response); err != nil {
			return nil, err
		}
		return nil, err
	}

	return session, nil
}

func SessionLoop(conn *websocket.Conn) {
	words, err := GetWords(30)
	if err != nil {
		response := SessionMessage{
			MessageType: ERROR,
			Data:        OPEN_SESSION,
		}
		conn.WriteJSON(&response)
		return

	}

	wordsResponse := SessionMessage{
		MessageType: INIT,
		Data:        words,
	}

	if err := conn.WriteJSON(&wordsResponse); err != nil {
		return
	}

	for {
		message := SessionMessage{}
		if err := conn.ReadJSON(&message); err != nil {
			return
		}

		response := SessionMessage{
			MessageType: ACK,
			Data:        message.Data,
		}
		if err := conn.WriteJSON(&response); err != nil {
			return
		}
	}
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
