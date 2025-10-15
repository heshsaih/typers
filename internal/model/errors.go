package model

type ErrorMessage string

const (
	INVALID_BODY          ErrorMessage = "INVALID_BODY"
	USERNAME_TAKEN        ErrorMessage = "USER_EXISTS"
	INVALID_PASSWORD      ErrorMessage = "INVALID_PASSWORD"
	INTERNAL_SERVER_ERROR ErrorMessage = "INTERNAL_SERVER_ERROR"
)
