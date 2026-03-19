import {
    useRef,
    useState,
    type ChangeEventHandler,
    type FC,
    type KeyboardEventHandler,
} from "react";
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
    isWordsMode: boolean;
};

export const TextContainer: FC<TextContainerProps> = ({
    mappedWords,
    cursorPos,
    handleKeyboardClick,
    startLoop,
    isPlaying,
    isWordsMode,
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

    const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
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

    const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        const navKeys = [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End",
        ];

        const textManipulationKeys = ["a", "A", "c", "C", "v", "V", "x", "X"];

        if (
            navKeys.includes(e.key) ||
            (e.ctrlKey && textManipulationKeys.includes(e.key))
        ) {
            e.preventDefault();
        }
    };

    const renderTextField = () => {
        let low;
        let high;

        if (isWordsMode) {
            low = 0;
            high = mappedWords.length;
        } else {
            low = cursorPos.w < 30 ? 0 : Math.ceil((cursorPos.w - 30) / 10) * 10;
            high =
                cursorPos.w < 30 ? 60 : Math.ceil((cursorPos.w - 30) / 10) * 10 + 60;
        }

        return mappedWords.slice(low, high).map((w, wi) => (
            <span key={wi + low} className="inline-block">
                <span className="whitespace-pre"> </span>
                {cursorPos.w === wi + low && cursorPos.l === 0 && hasFocus && (
                    <Cursor ref={cursorRef}></Cursor>
                )}
                <span className={getWordColor(w.status)}>
                    {w.letters.map((l, li) => (
                        <span key={li}>
                            <span className={getLetterColor(l.status)}>{l.letter}</span>
                            {cursorPos.w === wi + low &&
                                cursorPos.l - 1 === li &&
                                hasFocus && <Cursor ref={cursorRef}></Cursor>}
                        </span>
                    ))}
                </span>
            </span>
        ));
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
                onKeyDown={handleOnKeyDown}
                onChange={handleInput}
                id="text-container"
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            ></input>
            {renderTextField()}
        </div>
    );
};
