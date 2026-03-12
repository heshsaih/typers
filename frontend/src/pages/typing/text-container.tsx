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

type WordStatus = "NONE" | "CORRET" | "INCORRECT";
type LetterStatus = "NONE" | "CORRECT" | "INCORRECT";

type Word = {
    letters: Letter[];
    status: WordStatus;
};

type Letter = {
    letter: string;
    status: LetterStatus;
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
            if (e.code === "Backspace") {
                if (cursorPos.l === 0) {
                    setCursorPos({
                        w: cursorPos.w - 1,
                        l: e.ctrlKey ? 0 : mappedWords[cursorPos.w - 1].letters.length,
                    });
                    return;
                }
                setCursorPos({
                    w: cursorPos.w,
                    l: e.ctrlKey ? 0 : cursorPos.l - 1,
                });
                return;
            }

            if (e.code === "Space") {
                setCursorPos({
                    w: cursorPos.w + 1,
                    l: 0,
                });
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

            if (cursorPos.l >= mappedWords[cursorPos.w].letters.length) {
                setCursorPos({
                    w: cursorPos.w + 1,
                    l: 0,
                });

                return;
            }
            setCursorPos({
                w: cursorPos.w,
                l: cursorPos.l + 1,
            });
        };

        document.addEventListener("keydown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleClick);
        };
    }, [cursorPos]);

    console.log(cursorPos);

    return (
        <div className="relative text-3xl w-11/12 text-center overflow-visible">
            {mappedWords.map((w, wi) => (
                <span className="inline-block">
                    <span className="whitespace-pre"> </span>
                    {cursorPos.w === wi && cursorPos.l === 0 && <Cursor></Cursor>}
                    <span className="">
                        {w.letters.map((l, li) => (
                            <>
                                <span className="text-text-disabled">{l.letter}</span>
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
