import { useEffect, type FC } from "react";
import { useInputHandling } from "../../hooks/use-input-handling";

export const TypingPage: FC = () => {
    const state = useInputHandling();

    useEffect(() => {
        console.log(state);
    }, [state]);

    return <></>;
};
