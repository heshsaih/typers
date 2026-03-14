import { useEffect, useRef, useState, type FC } from "react";
import { Cursor } from "../../components/cursor";
import {
    getLetterColor,
    getWordColor,
    type CursorPosition,
    type Word,
} from "../../hooks/use-typing-logic";

type TextContainerProps = {
    mappedWords: Word[];
    cursorPos: CursorPosition;
    handleKeyboardClick: (e: KeyboardEvent) => void;
};

export const TextContainer: FC<TextContainerProps> = ({
    mappedWords,
    cursorPos,
    handleKeyboardClick,
}) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [hasFocus, setHasFocus] = useState<boolean>(false);

    useEffect(() => {
        const handleClick = (e: KeyboardEvent) => {
            if (hasFocus) {
                handleKeyboardClick(e);
            }
        };

        document.addEventListener("keydown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleClick);
        };
    }, [cursorPos, hasFocus]);

    return (
        <div
            onClick={() => ref.current?.focus()}
            className="relative text-3xl w-11/12 text-center overflow-visible mb-5"
        >
            <button
                ref={ref}
                autoFocus
                id="text-container"
                className="focus:outline-none"
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            ></button>
            {mappedWords.map((w, wi) => (
                <span className="inline-block">
                    <span className="whitespace-pre"> </span>
                    {cursorPos.w === wi && cursorPos.l === 0 && hasFocus && (
                        <Cursor></Cursor>
                    )}
                    <span className={getWordColor(w.status)}>
                        {w.letters.map((l, li) => (
                            <>
                                <span className={getLetterColor(l.status)}>{l.letter}</span>
                                {cursorPos.w === wi && cursorPos.l - 1 === li && hasFocus && (
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
