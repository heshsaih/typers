import { useEffect, useState, type FC } from "react";
import { Cursor } from "../../components/cursor";

type TextContainerProps = {
    words: string[];
};

// w -> word; l -> letter
type CursorPosition = {
    w: number;
    l: number;
};

type WordStatus = "NONE" | "CORRECT" | "INCORRECT";
type LetterStatus = "NONE" | "CORRECT" | "INCORRECT";

type Word = {
    letters: Letter[];
    status: WordStatus;
};

type Letter = {
    letter: string;
    status: LetterStatus;
};

const getWordColor = (status: WordStatus) => {
    switch (status) {
        case "NONE":
            return "";
        case "INCORRECT":
            return "underline decoration-error";
        case "CORRECT":
            return "";
    }
};

const getLetterColor = (status: LetterStatus) => {
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

const handleKeyboardClick = (
    e: KeyboardEvent,
    words: Word[],
    currentCursorPos: CursorPosition,
): {
    newCursorPos: CursorPosition;
    words: Word[];
} => {
    let newCursorPos = currentCursorPos;
    if (e.code === "Backspace") {
        if (currentCursorPos.w === 0 && currentCursorPos.l === 0) {
            return {
                newCursorPos: currentCursorPos,
                words,
            };
        }

        if (currentCursorPos.l === 0) {
            const newCursorPosW = currentCursorPos.w - 1;
            let newCursorPosL = 0;
            if (e.ctrlKey) {
                newCursorPosL = 0;
            } else {
                for (let i = words[newCursorPosW].letters.length - 1; i >= 0; i--) {
                    if (words[newCursorPosW].letters[i].status !== "NONE") {
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
                w: currentCursorPos.w,
                l: e.ctrlKey ? 0 : currentCursorPos.l - 1,
            };
        }

        if (e.ctrlKey) {
            words[newCursorPos.w].status = "NONE";
            setLettersStatus(
                words,
                newCursorPos.w,
                0,
                words[newCursorPos.w].letters.length,
                "NONE",
            );
        } else {
            setLettersStatus(
                words,
                newCursorPos.w,
                newCursorPos.l,
                newCursorPos.l + 1,
                "NONE",
            );

            if (
                !words[newCursorPos.w].letters.find(
                    (letter) => letter.status === "INCORRECT",
                )
            ) {
                words[newCursorPos.w].status = "CORRECT";
            }
        }

        return {
            newCursorPos,
            words,
        };
    }

    if (e.code === "Space") {
        newCursorPos = {
            w: currentCursorPos.w + 1,
            l: 0,
        };

        if (currentCursorPos.l < words[currentCursorPos.w].letters.length) {
            words[currentCursorPos.w].status = "INCORRECT";
        }

        return {
            newCursorPos,
            words,
        };
    }

    if (e.key.length !== 1) {
        return {
            newCursorPos,
            words,
        };
    }

    const keyCode = e.key.charCodeAt(0);
    if (!(keyCode >= 65 && keyCode <= 90) && !(keyCode >= 97 && keyCode <= 122)) {
        return {
            newCursorPos,
            words,
        };
    }

    if (words[newCursorPos.w].letters[newCursorPos.l].letter === e.key) {
        words[newCursorPos.w].letters[newCursorPos.l].status = "CORRECT";
        if (
            !words[newCursorPos.w].letters.find(
                (letter) => letter.status === "INCORRECT",
            )
        ) {
            words[newCursorPos.w].status = "CORRECT";
        }
    } else {
        words[newCursorPos.w].letters[newCursorPos.l].status = "INCORRECT";
        words[newCursorPos.w].status = "INCORRECT";
    }

    if (currentCursorPos.l >= words[currentCursorPos.w].letters.length) {
        newCursorPos = {
            w: currentCursorPos.w + 1,
            l: 0,
        };
    } else {
        newCursorPos = {
            w: currentCursorPos.w,
            l: currentCursorPos.l + 1,
        };
    }

    return {
        newCursorPos,
        words,
    };
};

export const TextContainer: FC<TextContainerProps> = ({ words }) => {
    const [cursorPos, setCursorPos] = useState<CursorPosition>({
        w: 0,
        l: 0,
    });

    const [mappedWords, setMappedWords] = useState<Word[]>(() => {
        return words.map((word) => ({
            letters: word.split("").map((letter) => ({
                letter: letter,
                status: "NONE",
            })),
            status: "NONE",
        }));
    });

    useEffect(() => {
        const handleClick = (e: KeyboardEvent) => {
            const result = handleKeyboardClick(e, mappedWords, cursorPos);
            setMappedWords(result.words);
            setCursorPos(result.newCursorPos);
        };

        document.addEventListener("keydown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleClick);
        };
    }, [cursorPos]);

    return (
        <div className="relative text-3xl w-11/12 text-center overflow-visible mb-5">
            <button autoFocus className="invisible"></button>
            {mappedWords.map((w, wi) => (
                <span className="inline-block">
                    <span className="whitespace-pre"> </span>
                    {cursorPos.w === wi && cursorPos.l === 0 && <Cursor></Cursor>}
                    <span className={getWordColor(w.status)}>
                        {w.letters.map((l, li) => (
                            <>
                                <span className={getLetterColor(l.status)}>{l.letter}</span>
                                {cursorPos.w === wi && cursorPos.l - 1 === li && (
                                    <Cursor></Cursor>
                                )}
                            </>
                        ))}
                    </span>
                </span>
            ))}
        </div>
    );
};
