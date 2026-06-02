import {
    useLayoutEffect,
    useRef,
    type ChangeEvent,
    type FC,
    type KeyboardEventHandler,
    type PropsWithChildren,
} from "react";
import { create } from "zustand";

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

type InputStore = {
    input: string;
    setInput: (str: string | ChangeEvent<HTMLInputElement>) => void;
    hasFocus: boolean;
    setHasFocus: (value: boolean) => void;
    resetState: () => void;
};

export const useInputStore = create<InputStore>((set) => ({
    input: "",
    setInput: (value) =>
        set({ input: typeof value === "string" ? value : value.target.value }),
    hasFocus: false,
    setHasFocus: (value) => set({ hasFocus: value }),
    resetState: () =>
        set({
            hasFocus: true,
            input: "",
        }),
}));

export const InputController: FC<PropsWithChildren> = ({ children }) => {
    const { input, setInput, resetState, setHasFocus } = useInputStore();
    const ref = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        resetState();
    }, []);

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
