import { Heading } from "../../components/heading";
import { Container } from "../../components/container";
import { useEffect, useState, type FC } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Paragraph } from "../../components/paragraph";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useAccountStore } from "../../stores/use-account-store";

export const TypingPage: FC = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        "wss://localhost:42069/api/v1/typing",
        {
            shouldReconnect: () => false,
        },
    );
    const { token } = useAccountStore();
    const [message, setMessage] = useState<string>("");
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        console.log("WS State: ", readyState);
        if (readyState === ReadyState.OPEN && !authenticated) {
            sendMessage(token ?? "");
            setAuthenticated(true);
        }    
    }, [readyState]);

    useEffect(() => {
        console.log("Message: ", lastMessage);
    }, [lastMessage]);

    return (
        <Container>
            <Heading type="h2">Typing</Heading>
            <Heading type="h4">Last response</Heading>
            <Paragraph>{`${lastMessage?.data}`}</Paragraph>
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></Input>
            <Button onClick={() => sendMessage(message)}>Send</Button>
        </Container>
    );
};
