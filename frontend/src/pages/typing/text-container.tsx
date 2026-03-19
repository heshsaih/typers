import { useRef, useState, type ChangeEvent, type FC } from "react";
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
    handleKeyboardClick: (inputText: string) => void;
    isPlaying: boolean;
    startLoop: () => void;
};

export const TextContainer: FC<TextContainerProps> = ({
    mappedWords,
    cursorPos,
    handleKeyboardClick,
    startLoop,
    isPlaying,
}) => {
    const ref = useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = useState<boolean>(false);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const [text, setText] = useState<string>("");

    const validateInput = (text: string): boolean => {
        const words = text.split(" ");
        if (words.length > mappedWords.length) {
            return false;
        }

        if (
            words[words.length - 1].length >
            mappedWords[words.length - 1].letters.length
        ) {
            return false;
        }

        return true;
    };

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (hasFocus) {
            if (!isPlaying) {
                startLoop();
            }
            if (validateInput(e.target.value)) {
                handleKeyboardClick(e.target.value);
                setText(e.target.value);
            }
        }
    };

    return (
        <div
            onClick={() => ref.current?.focus()}
            className="relative text-3xl w-11/12 text-center mb-5"
        >
            <input
                ref={ref}
                autoFocus
                value={text}
                onChange={handleInput}
                id="text-container"
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            ></input>
            {mappedWords
                .slice(
                    Math.floor(cursorPos.w / 60) * 60,
                    Math.ceil((cursorPos.w + 1) / 60) * 60,
                )
                .map((w, wi) => (
                    <span
                        key={wi + Math.floor(cursorPos.w / 60) * 60}
                        className="inline-block"
                    >
                        <span className="whitespace-pre"> </span>
                        {cursorPos.w === wi + Math.floor(cursorPos.w / 60) * 60 &&
                            cursorPos.l === 0 &&
                            hasFocus && <Cursor ref={cursorRef}></Cursor>}
                        <span className={getWordColor(w.status)}>
                            {w.letters.map((l, li) => (
                                <span key={li}>
                                    <span className={getLetterColor(l.status)}>{l.letter}</span>
                                    {cursorPos.w === wi + Math.floor(cursorPos.w / 60) * 60 &&
                                        cursorPos.l - 1 === li &&
                                        hasFocus && <Cursor ref={cursorRef}></Cursor>}
                                </span>
                            ))}
                        </span>
                    </span>
                ))}
        </div>
    );
};
