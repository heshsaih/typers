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

    const handleKeyboardClick = (e: KeyboardEvent) => {
        let newCursorPos = cursorPos;
        let newMappedWords = mappedWords;
        if (e.code === "Backspace") {
            if (cursorPos.w === 0 && cursorPos.l === 0) {
                return;
            }

            if (cursorPos.l === 0) {
                const newCursorPosW = cursorPos.w - 1;
                let newCursorPosL = 0;
                if (!e.ctrlKey) {
                    for (
                        let i = mappedWords[newCursorPosW].letters.length - 1;
                        i >= 0;
                        i--
                    ) {
                        if (mappedWords[newCursorPosW].letters[i].status !== "NONE") {
                            newCursorPosL = i + 1;
                            break;
                        }
                    }
                }

                newCursorPos = {
                    w: newCursorPosW,
                    l: newCursorPosL,
                };
            } else {
                newCursorPos = {
                    w: cursorPos.w,
                    l: e.ctrlKey ? 0 : cursorPos.l - 1,
                };
            }

            if (e.ctrlKey) {
                newMappedWords[newCursorPos.w].status = "NONE";
                setLettersStatus(
                    newMappedWords,
                    newCursorPos.w,
                    0,
                    mappedWords[newCursorPos.w].letters.length,
                    "NONE",
                );
            } else {
                setLettersStatus(
                    newMappedWords,
                    newCursorPos.w,
                    newCursorPos.l,
                    newCursorPos.l + 1,
                    "NONE",
                );

                if (
                    !mappedWords[newCursorPos.w].letters.find(
                        (letter) => letter.status === "INCORRECT",
                    )
                ) {
                    newMappedWords[newCursorPos.w].status = "CORRECT";
                }
            }

            setMappedWords(newMappedWords);
            setCursorPos(newCursorPos);
            return;
        }

        if (e.code === "Space") {
            newCursorPos = {
                w: cursorPos.w + 1,
                l: 0,
            };

            if (cursorPos.l < mappedWords[cursorPos.w].letters.length) {
                newMappedWords[cursorPos.w].status = "INCORRECT";
            }

            setMappedWords(newMappedWords);
            setCursorPos(newCursorPos);
            return;
        }

        if (e.key.length !== 1) {
            return;
        }

        const keyCode = e.key.charCodeAt(0);
        if (
            !(keyCode >= 65 && keyCode <= 90) &&
            !(keyCode >= 97 && keyCode <= 122)
        ) {
            return;
        }

        if (
            mappedWords.length <= newCursorPos.w ||
            mappedWords[newCursorPos.w].letters.length <= newCursorPos.l
        ) {
            return;
        }

        if (mappedWords[newCursorPos.w].letters[newCursorPos.l].letter === e.key) {
            mappedWords[newCursorPos.w].letters[newCursorPos.l].status = "CORRECT";
            if (
                !mappedWords[newCursorPos.w].letters.find(
                    (letter) => letter.status === "INCORRECT",
                )
            ) {
                newMappedWords[newCursorPos.w].status = "CORRECT";
            }
        } else {
            newMappedWords[newCursorPos.w].letters[newCursorPos.l].status =
                "INCORRECT";
            newMappedWords[newCursorPos.w].status = "INCORRECT";
        }

        if (cursorPos.l >= mappedWords[cursorPos.w].letters.length) {
            newCursorPos = {
                w: cursorPos.w + 1,
                l: 0,
            };
        } else {
            newCursorPos = {
                w: cursorPos.w,
                l: cursorPos.l + 1,
            };
        }

        setMappedWords(newMappedWords);
        setCursorPos(newCursorPos);
    };

    return {
        cursorPos,
        mappedWords,
        handleKeyboardClick,
        setMappedWords,
        setCursorPos,
    };
};
