package services

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"typers/internal/enums"
)

func GetWords(amount int) ([]string, error) {
	wordApi := os.Getenv("WORD_API");
	if (len(wordApi) == 0) {
		return nil, errors.New(string(enums.ERR_WORD_API_UNAVAILABLE))
	}

	resp, err := http.Get(fmt.Sprintf("%s/word?number=%d", wordApi, amount))
	if (err != nil) {
		return nil, errors.New(string(enums.ERR_WORD_API_UNAVAILABLE))
	}

	body, err := io.ReadAll(resp.Body)
	if (err != nil) {
		return nil, errors.New(string(enums.ERR_WORD_API_UNAVAILABLE))
	}

	noQuotes:= strings.ReplaceAll(string(body), "\"", "")
	trimmed := strings.TrimRight(strings.TrimLeft(noQuotes, "["), "]")

	return strings.Split(trimmed, ","), nil
}
