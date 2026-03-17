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
    isPlaying: boolean;
    startLoop: () => void;
};

const isAlphanumeric = (e: string) => {
    if (e.length !== 1) return false;
    const code = e.charCodeAt(0);
    return (code > 64 && code < 91) || (code > 96 && code < 123);
};

export const TextContainer: FC<TextContainerProps> = ({
    mappedWords,
    cursorPos,
    handleKeyboardClick,
    startLoop,
    isPlaying,
}) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [hasFocus, setHasFocus] = useState<boolean>(false);
    const cursorRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const handleClick = (e: KeyboardEvent) => {
            if (hasFocus) {
                if (!isPlaying && isAlphanumeric(e.key)) {
                    startLoop();
                }
                handleKeyboardClick(e);
            }
        };

        cursorRef.current?.scrollIntoView();

        document.addEventListener("keydown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleClick);
        };
    }, [cursorPos, hasFocus]);

    return (
        <div
            onClick={() => ref.current?.focus()}
            className="relative text-3xl w-11/12 text-center max-h-75 overflow-hidden mb-5"
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
                <span key={wi} className="inline-block">
                    <span className="whitespace-pre"> </span>
                    {cursorPos.w === wi && cursorPos.l === 0 && hasFocus && (
                        <Cursor ref={cursorRef}></Cursor>
                    )}
                    <span className={getWordColor(w.status)}>
                        {w.letters.map((l, li) => (
                            <span key={li}>
                                <span className={getLetterColor(l.status)}>
                                    {l.letter}
                                </span>
                                {cursorPos.w === wi && cursorPos.l - 1 === li && hasFocus && (
                                    <Cursor ref={cursorRef}></Cursor>
                                )}
                            </span>
                        ))}
                    </span>
                </span>
            ))}
        </div>
    );
};
