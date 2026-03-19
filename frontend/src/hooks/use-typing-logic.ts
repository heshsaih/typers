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

const setLettersStatus = (
    words: Word[],
    wi: number,
    listart: number,
    liend: number,
    status: LetterStatus,
): Word[] => {
    if (listart >= words[wi].letters.length || liend > words[wi].letters.length) {
        return words;
    }

    for (let i = listart; i < liend; i++) {
        words[wi].letters[i].status = status;
    }

    return words;
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
        console.log(currentWords);
        setCursorPos({
            w: currentWords.length - 1,
            l: currentWords[currentWords.length - 1].length,
        });
    };

    return {
        cursorPos,
        mappedWords,
        handleKeyboardClick,
        setMappedWords,
        setCursorPos,
    };
};
