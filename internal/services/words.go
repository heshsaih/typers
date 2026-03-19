package services

import (
	"bufio"
	"math/rand"
	"os"
)

type ApiResponse []struct {
	Word     string
	Length   int
	Category string
	Language string
}

var words []string = nil

func init() {
	filepath := "resources/words.txt"

	file, err := os.Open(filepath)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	words = make([]string, 0, 3000)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		words = append(words, scanner.Text())
	}
}

func GetWords(amount int) ([]string, error) {
	result := make([]string, 0, amount)
	for range amount {
		i := rand.Intn(len(words) - 1)
		result = append(result, words[i])
	}
	return result, nil
}
