import { useEffect, useState } from "react";
import { useSession } from "./use-session";

type PressedKey = {
    key: string;
    isWithCtrl: boolean;
};

export type LetterStatus = "CORRECT" | "INCORRECT" | "NOT-TYPED";
export type Letter = {
    letter: string;
    status: LetterStatus;
};

export const useTypingLogic = () => {
    const { words } = useSession();
    const [mappedWords, setMappedWords] = useState<Array<Array<Letter>>>();
    const [wordIdx, setWordIdx] = useState<number>(0);
    const [letterIdx, setLetterIdx] = useState<number>(0);
    const [previousKey, setPreviousKey] = useState<PressedKey>();

    useEffect(() => {
        setMappedWords(
            words
                ? words.map((word) =>
                    word.split("").map<Letter>((letter) => ({
                        letter: letter,
                        status: "NOT-TYPED",
                    })),
                )
                : [],
        );
    }, [words]);

    const handleKeyPress = () => {
        if (!previousKey || !mappedWords) {
            return;
        }

        if (previousKey.key === " ") {
            if (
                !mappedWords[wordIdx].find((letter) => letter.status !== "NOT-TYPED")
            ) {
                return;
            }

            const newWordIdx =
                wordIdx + 1 < mappedWords.length ? wordIdx + 1 : mappedWords.length - 1;
            setWordIdx(newWordIdx);
            setLetterIdx(0);
            return;
        }

        if (previousKey.key === "Backspace") {
            if (wordIdx === 0 && letterIdx === 0) return;
            let lIdx = letterIdx - 1;
            let wIdx = wordIdx;

            if (previousKey.isWithCtrl) {
                lIdx = 0;
                if (letterIdx === 0) {
                    wIdx = wordIdx - 1 >= 0 ? wordIdx - 1 : 0;
                }
            } else {
                if (lIdx < 0) {
                    wIdx = wordIdx - 1 >= 0 ? wordIdx - 1 : 0;
                    const word = mappedWords[wIdx];
                    if (word[word.length - 1].status === "NOT-TYPED") {
                        for (let i = word.length - 1; i >= 0; i--) {
                            if (word[i].status !== "NOT-TYPED") {
                                lIdx = i + 1;
                                break;
                            }
                        }
                    } else {
                        lIdx = word.length;
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
            } else if (lIdx !== a[wIdx].length) {
                const letter = a[wIdx][lIdx];
                a[wIdx][lIdx] = {
                    letter: letter.letter,
                    status: "NOT-TYPED",
                };
            }
            setWordIdx(wIdx);
            setLetterIdx(lIdx);
            setMappedWords(a);
            return;
        }

        if (mappedWords[wordIdx].length === letterIdx) return;

        const currentWord = mappedWords[wordIdx];

        const a = [...mappedWords];
        a[wordIdx][letterIdx].status =
            previousKey.key === currentWord[letterIdx].letter
                ? "CORRECT"
                : "INCORRECT";

        if (letterIdx + 1 > currentWord.length - 1) {
            setLetterIdx(currentWord.length);
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
