import { useEffect, useState } from "react";

type InputValidator = (e: KeyboardEvent) => boolean;
type InputEffect = (e: KeyboardEvent) => void;

type InputHandlerProps = {
    intiialState?: string;
    validator?: InputValidator;
    sideEffect?: InputEffect;
};

export const useInputHandling = (props?: InputHandlerProps): string => {
    const [state, setState] = useState<string>(props?.intiialState ?? "");

    const handleInputEvent = (e: KeyboardEvent) => {
        if (props?.validator && !props.validator(e)) {
            return;
        }

        setState(state + e.key);

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
