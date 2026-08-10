package service

import (
	"bufio"
	"log"
	"math/rand"
	"os"
)

var words []string

func GetWords(amount int) []string {
	result := make([]string, 0)

	for range amount {
		word := words[rand.Intn(len(words))]
		if len(word) >= 6 {
			continue
		}
		result = append(result, word)
	}

	return result
}

func LoadWords() {
	path := os.Getenv("WORDS_FILE")
	if len(path) == 0 {
		log.Fatal("failed to load words: WORDS_FILE env is empty")
	}

	file, err := os.Open(path)
	if err != nil {
		log.Fatal("failed to load words: ", err)
	}

	result := make([]string, 0)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		result = append(result, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal("failed to read words: ", err)
	}

	words = result
}
