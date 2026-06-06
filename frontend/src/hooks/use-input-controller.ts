import type { ChangeEvent, RefObject } from "react";
import { create } from "zustand";

type InputStore = {
    input: string;
    setInput: (str: string | ChangeEvent<HTMLInputElement>) => void;
    hasFocus: boolean;
    setHasFocus: (value: boolean) => void;
    inputRef?: RefObject<HTMLInputElement | null>;
    setInputRef: (ref: RefObject<HTMLInputElement | null>) => void;
};

const inputStore = create<InputStore>((set) => ({
    input: "",
    setInput: (value) =>
        set({ input: typeof value === "string" ? value : value.target.value }),
    hasFocus: true,
    setHasFocus: (value) => set({ hasFocus: value }),
    inputRef: undefined,
    setInputRef: (ref) => set({ inputRef: ref }),
}));

export const useInputController = () => {
    const { input, setInput, hasFocus, setHasFocus, inputRef, setInputRef } =
        inputStore();

    return { input, setInput, hasFocus, setHasFocus, inputRef, setInputRef };
};
