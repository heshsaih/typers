import { Heading } from "../../components/heading";
import { Container } from "../../components/container";
import { useEffect, useState, type FC } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Paragraph } from "../../components/paragraph";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useAccountStore } from "../../stores/use-account-store";
import { SessionMessage, USER_UNAUTHENTICATED, type SessionMessageType } from "../../types";

export const TypingPage: FC = () => {
    const { sendJsonMessage, lastJsonMessage, readyState } =
        useWebSocket<SessionMessageType>("wss://localhost:42069/api/v1/typing", {
            shouldReconnect: () => false,
        });
    const { token } = useAccountStore();
    const [message, setMessage] = useState<string>("");
    const [authenticated, setAuthenticated] = useState<boolean>(false);

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
        console.log("Message: ", lastJsonMessage?.messageType);
    }, [lastJsonMessage]);

    return (
        <Container>
            <Heading type="h2">Typing</Heading>
            <Heading type="h4">Last response</Heading>
            <Paragraph>{`${lastJsonMessage?.data}`}</Paragraph>
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></Input>
            <Button
                onClick={() =>
                    sendJsonMessage<SessionMessageType>({
                        messageType: SessionMessage.WORD,
                        data: message,
                    })
                }
            >
                Send
            </Button>
        </Container>
    );
};
