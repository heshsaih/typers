import { useEffect, useState } from "react";
import type { Letter } from "./use-words";

type PressedKey = {
    key: string;
    isWithCtrl: boolean;
};

export const useTypingLogic = (words: Array<string> | undefined) => {
    const [wordIdx, setWordIdx] = useState<number>(0);
    const [letterIdx, setLetterIdx] = useState<number>(0);
    const [previousKey, setPreviousKey] = useState<PressedKey>();
    const [mappedWords, setMappedWords] = useState<Array<Array<Letter>>>();

    useEffect(() => {
        setMappedWords(
            words
                ? words.map((word) => [
                    ...word.split("").map<Letter>((letter) => ({
                        letter: letter,
                        status: "NOT-TYPED",
                    })),
                    {
                        letter: " ",
                        status: "SPACE",
                    },
                ])
                : [],
        )
    }, [words])

    const handleKeyPress = () => {
        if (!previousKey || !mappedWords) {
            return;
        }

        console.log(previousKey);

        if (previousKey.key === " ") {
            if (!mappedWords[wordIdx].find((letter) => letter.status !== "NOT-TYPED")) {
                return;
            }

            const newWordIdx =
                wordIdx + 1 < mappedWords.length ? wordIdx + 1 : mappedWords.length - 1;
            setWordIdx(newWordIdx);
            setLetterIdx(0);
            return;
        }

        if (previousKey.key === "Backspace") {
            let lIdx = letterIdx - 1;
            let wIdx = wordIdx;

            if (previousKey.isWithCtrl) {
                lIdx = 0;
                if (letterIdx === 0) {
                    wIdx = wordIdx - 1 >= 0 ? wordIdx - 1 : 0;
                }
            } else {
                if (lIdx < 0) {
                    if (wIdx === 0) {
                        lIdx = 0;
                    } else {
                        wIdx = wordIdx - 1 === 0 ? wordIdx - 1 : 0;
                        lIdx = mappedWords[wIdx].length - 1;
                    }
                }
            }

            const a = [...mappedWords];
            if (previousKey.isWithCtrl) {
                const word = a[wIdx].map<Letter>((letter) => ({
                    letter: letter.letter,
                    status: "NOT-TYPED",
                }));
                a[wIdx] = word;
            } else {
                const letter = a[wIdx][lIdx];
                a[wIdx][lIdx] = {
                    letter: letter.letter,
                    status: "NOT-TYPED",
                };
            }
            setWordIdx(wIdx);
            setLetterIdx(lIdx);
            return;
        }

        const currentWord = mappedWords[wordIdx];

        const a = [...mappedWords];
        a[wordIdx][letterIdx].status =
            previousKey.key === currentWord[letterIdx].letter
                ? "CORRECT"
                : "INCORRECT";

        if (letterIdx + 1 > currentWord.length - 1) {
            setLetterIdx(currentWord.length - 1);
            return;
        }

        setLetterIdx(letterIdx + 1);
    };

    useEffect(() => {
        const foo = (e: KeyboardEvent) => {
            const ok =
                (e.key.length === 1 && /[a-zA-Z ]/.test(e.key)) ||
                e.key === "Backspace";

            if (!ok) {
                return;
            }

            if (e.ctrlKey && e.key !== "Backspace") {
                setPreviousKey(undefined);
            } else {
                setPreviousKey({
                    key: e.key,
                    isWithCtrl: e.ctrlKey,
                });
            }
        };

        document.addEventListener("keydown", foo);

        return () => document.removeEventListener("keydown", foo);
    }, []);

    useEffect(() => handleKeyPress(), [previousKey]);

    return { mappedWords, wordIdx, letterIdx };
};
