import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useAccountStore } from "../stores/use-account-store";

export const SessionMessage = {
    AUTH: "AUTH",
    WORD: "WORD",
    INIT: "INIT",
} as const;
export type SessionMessageTypeKeys = keyof typeof SessionMessage;
export type SessionMessageTypeValues =
    (typeof SessionMessage)[SessionMessageTypeKeys];

export const USER_UNAUTHENTICATED = "UNAUTHENTICATED" as const;

export type SessionMessageType = {
    messageType: SessionMessageTypeValues;
    data: any;
};

export const useSession = () => {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<SessionMessageType | null>(
      "wss://localhost:42069/api/v1/session",
      {
        shouldReconnect: () => false,
      },
    );
  const { token } = useAccountStore();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [words, setWords] = useState<Array<string>>();

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

  return { words };
};
