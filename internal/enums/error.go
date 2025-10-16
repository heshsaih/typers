package enums

type ErrorMessage string

const (
	ERR_INVALID_BODY          ErrorMessage = "INVALID_BODY"
	ERR_USERNAME_TAKEN        ErrorMessage = "USER_EXISTS"
	ERR_INVALID_PASSWORD      ErrorMessage = "INVALID_PASSWORD"
	ERR_INTERNAL_SERVER_ERROR ErrorMessage = "INTERNAL_SERVER_ERROR"
)
