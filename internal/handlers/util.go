package handlers

type ResponseMessage string

const (
	INTERNAL_SERVER_ERROR_MESSAGE ResponseMessage = "internal server error"
	NOT_FOUND_MESSAGE = "resource not found"
	INVALID_BODY_MESSAGE = "invalid body"
)

type ErrorResponse struct {
	Error ResponseMessage
}

type ResultResponse struct {
	Data any
}
