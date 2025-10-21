import { Container } from "../../components/container";
import { useEffect, useRef, useState, type FC } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useAccountStore } from "../../stores/use-account-store";
import {
    SessionMessage,
    USER_UNAUTHENTICATED,
    type LetterStatus,
    type SessionMessageType,
} from "../../types";
import { TextField } from "../../components/textfield";

export const TypingPage: FC = () => {
    const { sendJsonMessage, lastJsonMessage, readyState } =
        useWebSocket<SessionMessageType | null>(
            "wss://localhost:42069/api/v1/typing",
            {
                shouldReconnect: () => false,
            },
        );
    const { token } = useAccountStore();
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [words, setWords] = useState<string[]>();
    const [letterArray, setLetterArray] = useState<
        Array<
            Array<{
                letter: string;
                status: LetterStatus;
            }>
        >
    >();
    const [currentWord, setCurrentWord] = useState<number>(0);
    const [currentLetter, setCurrentLetter] = useState<number>(0);

    useEffect(() => {
        if (words && !letterArray) {
            setLetterArray(
                words.map((word) =>
                    word.split("").map((letter) => ({
                        letter: letter,
                        status: "NOT-TYPED",
                    })),
                ),
            );
        }
    }, [words]);

    useEffect(
        () => console.log(currentWord, currentLetter),
        [currentWord, [currentLetter]],
    );

    const listen = (e: KeyboardEvent) => {
        console.log(e);

        const ok =
            (e.key.length === 1 && /[a-zA-Z ]/.test(e.key)) || e.key === "Backspace";

        if (!ok) {
            return;
        }

        e.preventDefault();
        if (letterArray) {
            if (e.key === " ") {
                if (currentLetter === 0) {
                    return;
                }

                setCurrentLetter(0);
                setCurrentWord(currentWord + 1);
                return;
            }

            if (e.key === "Backspace" && e.ctrlKey) {
                if (currentLetter != 0) {
                    setCurrentLetter(0);
                    setLetterArray((a) => {
                        const foo = a[currentWord].map((b) => ({
                            letter: b.letter,
                            status: "NOT-TYPED",
                        }));
                        a[currentWord] = foo;
                        return a;
                    });
                } else {
                    if (currentWord === 0) {
                        return;
                    }
                    setCurrentWord(currentWord - 1);
                    setLetterArray((a) => {
                        const foo = a[currentWord - 1].map((b) => ({
                            letter: b.letter,
                            status: "NOT-TYPED",
                        }));
                        a[currentWord] = foo;
                        return a;
                    });
                }
            }

            if (e.key === "Backspace") {
                const correctLetter = letterArray[currentWord][currentLetter - 1];
                correctLetter.status = "NOT-TYPED";
                setLetterArray((a) => {
                    a[currentWord][currentLetter - 1] = correctLetter;
                    return a;
                });

                if (currentLetter != 0) {
                    setCurrentLetter(currentLetter - 1);
                    return;
                }

                if (currentWord != 0) {
                    setCurrentWord(currentWord - 1);
                    setCurrentLetter(letterArray[currentWord - 1].length - 1);
                    return;
                }
            }

            const correctLetter = letterArray[currentWord][currentLetter];
            if (correctLetter.letter === e.key) {
                correctLetter.status = "CORRECT";
            } else {
                correctLetter.status = "INCORRECT";
            }

            console.log(correctLetter);

            setCurrentLetter(currentLetter + 1);
            setLetterArray((a) => {
                a[currentWord][currentLetter] = correctLetter;
                return a;
            });
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", listen);

        return () => document.removeEventListener("keydown", listen);
    }, [letterArray, currentLetter, currentWord]);

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
            setWords(lastJsonMessage.data);
        }
    }, [lastJsonMessage]);

    return (
        <Container className="w-full">
            <div></div>
            <TextField words={letterArray}></TextField>
        </Container>
    );
};
