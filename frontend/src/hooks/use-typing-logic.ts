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
            const newWordIdx =
                wordIdx + 1 < wordsArray.length ? wordIdx + 1 : wordsArray.length - 1;
            setWordIdx(newWordIdx);
            setLetterIdx(0);
            return;
        }

        if (previousKey.key === "Backspace") {
            const newWordIdx = wordIdx - 1 >= 0 ? wordIdx - 1 : 0;
            if (letterIdx === 0) {
                setWordIdx(newWordIdx);
            }
            const newLetterIDx =
                letterIdx - 1 >= 0 ? letterIdx - 1 : wordsArray[wordIdx - 1].length - 1;
            setLetterIdx(newLetterIDx);
            const a = [...wordsArray];
            a[newWordIdx][newLetterIDx].status = "NOT-TYPED";
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

            e.preventDefault();

            setPreviousKey({
                key: e.key,
                isWithCtrl: e.ctrlKey,
            });
        };

        document.addEventListener("keydown", foo);

        return () => document.removeEventListener("keydown", foo);
    }, []);

    useEffect(() => handleKeyPress(), [previousKey]);

    return { wordIdx, letterIdx };
};
