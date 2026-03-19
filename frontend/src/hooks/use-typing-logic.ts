import { useEffect, useState } from "react";

export type CursorPosition = {
    w: number;
    l: number;
};

type WordStatus = "NONE" | "CORRECT" | "INCORRECT";
type LetterStatus = "NONE" | "CORRECT" | "INCORRECT";

export type Word = {
    letters: Letter[];
    status: WordStatus;
};

type Letter = {
    letter: string;
    status: LetterStatus;
};

export const getWordColor = (status: WordStatus) => {
    switch (status) {
        case "NONE":
            return "";
        case "INCORRECT":
            return "underline decoration-error";
        case "CORRECT":
            return "";
    }
};

export const getLetterColor = (status: LetterStatus) => {
    switch (status) {
        case "NONE":
            return "text-text-disabled";
        case "INCORRECT":
            return "text-error";
        case "CORRECT":
            return "text-text";
    }
};

export const useTypingLogic = (words: string[] | null) => {
    const [cursorPos, setCursorPos] = useState<CursorPosition>({
        w: 0,
        l: 0,
    });

    const [mappedWords, setMappedWords] = useState<Word[]>([]);

    useEffect(() => {
        setMappedWords(
            words?.map((word) => ({
                letters: word.split("").map((letter) => ({
                    letter: letter,
                    status: "NONE",
                })),
                status: "NONE",
            })) ?? [],
        );
        setCursorPos({
            w: 0,
            l: 0,
        });
    }, [words]);

    const handleKeyboardClick = (inputText: string) => {
        const currentWords = inputText.split(" ");
        setCursorPos({
            w: currentWords.length - 1,
            l: currentWords[currentWords.length - 1].length,
        });

        let newMappedWords = [...mappedWords];

        for (let i = 0; i < newMappedWords.length; i++) {
            newMappedWords[i].status = "NONE";
            if (i < currentWords.length) {
                for (let j = 0; j < newMappedWords[i].letters.length; j++) {
                    newMappedWords[i].letters[j].status = "NONE";
                }
            }
        }

        for (let i = 0; i < currentWords.length; i++) {
            let newMappedWord = newMappedWords[i];

            if (currentWords[i] === newMappedWord.letters.join("")) {
                newMappedWord.status = "CORRECT";
            } else {
                if (
                    currentWords[i].length < newMappedWord.letters.length &&
                    i !== currentWords.length - 1
                ) {
                    newMappedWord.status = "INCORRECT";
                }

                for (let j = 0; j < currentWords[i].length; j++) {
                    const currentLetter = newMappedWord.letters[j];
                    if (currentLetter.letter === currentWords[i][j]) {
                        currentLetter.status = "CORRECT";
                    } else {
                        currentLetter.status = "INCORRECT";
                        newMappedWord.status = "INCORRECT";
                    }
                }
            }
        }
        setMappedWords(newMappedWords);
    };

    return {
        cursorPos,
        mappedWords,
        handleKeyboardClick,
        setMappedWords,
        setCursorPos,
    };
};
