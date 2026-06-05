import {
    useLayoutEffect,
    useRef,
    type FC,
    type KeyboardEventHandler,
    type PropsWithChildren,
} from "react";
import { useInputController } from "../hooks/use-input-controller";

const NAVIGATION_KEYS = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
] as const;

type NavigationKeys = (typeof NAVIGATION_KEYS)[number];

const TEXT_MANIPULATION_KEYS = [
    "a",
    "A",
    "c",
    "C",
    "v",
    "V",
    "x",
    "X",
] as const;

type TextManipulaitonKeys = (typeof TEXT_MANIPULATION_KEYS)[number];

export const InputController: FC<PropsWithChildren> = ({ children }) => {
    const { setInputRef, setHasFocus, input, setInput } = useInputController();
    const ref = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        setInputRef(ref);
    }, [ref]);

    const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (
            NAVIGATION_KEYS.includes(e.key as NavigationKeys) ||
            (TEXT_MANIPULATION_KEYS.includes(e.key as TextManipulaitonKeys) &&
                e.ctrlKey)
        ) {
            e.preventDefault();
        }
    };

    return (
        <div className="w-full" onClick={() => ref.current?.focus()}>
            {children}
            <input
                ref={ref}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
                value={input}
                onChange={setInput}
                onKeyDown={handleOnKeyDown}
                autoFocus
                className="absolute opacity-0 pointer-events-none w-0 h-0"
            ></input>
        </div>
    );
};
