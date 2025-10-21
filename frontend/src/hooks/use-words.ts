import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useAccountStore } from "../stores/use-account-store";
import {
    type SessionMessageType,
    SessionMessage,
    USER_UNAUTHENTICATED,
} from "../types";

export type LetterStatus = "CORRECT" | "INCORRECT" | "NOT-TYPED";
export type Letter = {
    letter: string;
    status: LetterStatus;
};

export const useWords = () => {
    const { sendJsonMessage, lastJsonMessage, readyState } =
        useWebSocket<SessionMessageType | null>(
            "wss://localhost:42069/api/v1/typing",
            {
                shouldReconnect: () => false,
            },
        );
    const { token } = useAccountStore();
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [wordsArray, setWordsArray] = useState<Array<Array<Letter>>>();

    useEffect(() => {
        console.log("WS State: ", readyState);
        if (readyState === ReadyState.OPEN && !authenticated) {
            sendJsonMessage<SessionMessageType>({
                messageType: SessionMessage.AUTH,
                data: token ?? USER_UNAUTHENTICATED,
            });
            setAuthenticated(true);
        }
    }, [readyState]);

    useEffect(() => {
        console.log("Message: ", lastJsonMessage);
        if (lastJsonMessage?.messageType === SessionMessage.INIT) {
            setWordsArray(
                (lastJsonMessage.data as string[]).map((word) =>
                    word.split("").map((letter) => ({
                        letter: letter,
                        status: "NOT-TYPED",
                    })),
                ),
            );
        }
    }, [lastJsonMessage]);

    return { wordsArray, setWordsArray };
};
