import { useEffect, useState } from "react";
import type { Letter } from "./use-words";

type PressedKey = {
    key: string;
    isWithCtrl: boolean;
};

export const useTypingLogic = (
    wordsArray: Array<Array<Letter>> | undefined,
    setWordsArray: (newWordsArray: Array<Array<Letter>>) => void,
) => {
    const [wordIdx, setWordIdx] = useState<number>(0);
    const [letterIdx, setLetterIdx] = useState<number>(0);
    const [previousKey, setPreviousKey] = useState<PressedKey>();

    const handleKeyPress = () => {
        if (!previousKey || !wordsArray) {
            return;
        }

        console.log(previousKey);

        if (previousKey.key === " ") {
            if (!wordsArray[wordIdx].find(letter => letter.status !== "NOT-TYPED")) {
                return;
            }

            const newWordIdx =
                wordIdx + 1 < wordsArray.length ? wordIdx + 1 : wordsArray.length - 1;
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
                        lIdx = wordsArray[wIdx].length - 1;
                    }
                }
            }

            const a = [...wordsArray];
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
            setWordsArray(a);
            return;
        }

        const currentWord = wordsArray[wordIdx];

        const a = [...wordsArray];
        a[wordIdx][letterIdx].status =
            previousKey.key === currentWord[letterIdx].letter
                ? "CORRECT"
                : "INCORRECT";
        setWordsArray(a);

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

    return { wordIdx, letterIdx };
};
