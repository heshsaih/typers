package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"typers/internal/enums"
)

type ApiResponse []struct {
	Word     string
	Length   int
	Category string
	Language string
}

func GetWords(amount int) ([]string, error) {
	wordApi := os.Getenv("WORD_API")
	if len(wordApi) == 0 {
		return nil, errors.New(string(enums.ERR_WORD_API_UNAVAILABLE))
	}

	resp, err := http.Get(fmt.Sprintf("%s?language=en&words=%d", wordApi, amount))
	if err != nil {
		return nil, errors.New(string(enums.ERR_WORD_API_UNAVAILABLE))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.New(string(enums.ERR_WORD_API_UNAVAILABLE))
	}

	var parsedApiResponse ApiResponse
	if err := json.Unmarshal(body, &parsedApiResponse); err != nil {
		return nil, errors.New(string(enums.ERR_WORD_API_UNAVAILABLE))
	}

	var response []string
	for i := range parsedApiResponse {
		response = append(response, parsedApiResponse[i].Word)
	}

	return response, nil
}
