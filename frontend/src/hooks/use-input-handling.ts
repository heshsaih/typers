import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { create } from "zustand";

type InputValidator = (e: KeyboardEvent) => boolean;
type InputEffect = (e: KeyboardEvent) => void;

type InputHandlerProps = {
    intialState?: string;
    validator?: InputValidator;
    setter?: Dispatch<SetStateAction<string>>;
    sideEffect?: InputEffect;
};

export const useInputHandling = (props?: InputHandlerProps): string => {
    const [state, setState] = useState<string>(props?.intialState ?? "");

    const handleInputEvent = (e: KeyboardEvent) => {
        if (props?.validator && !props.validator(e)) {
            return;
        }

        setState();

        if (props?.sideEffect) {
            props.sideEffect(e);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleInputEvent);

        return () => document.removeEventListener("keydown", handleInputEvent);
    }, [state]);

    return state;
};
