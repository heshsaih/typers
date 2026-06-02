import { useEffect, type FC } from "react";
import { useInputHandling } from "../../hooks/use-input-handling";
import { Container } from "../../components/container";
import {
    InputController,
    useInputStore,
} from "../../components/input-controller";
import { useWords } from "../../hooks/use-words";
import { Spinner } from "../../components/spinner";

export const TypingPage: FC = () => {
    const state = useInputHandling();
    const { input } = useInputStore();
    const { data, isPending, error } = useWords();

    useEffect(() => {
        console.log(state);
    }, [state]);

    return (
        <Container>
            <InputController>
                <Container>
                    <h1>typing tego</h1>
                    <div>{input}</div>
                    {isPending && <Spinner></Spinner>}
                    {data?.words.map((a) => (
                        <span>{a}</span>
                    ))}
                    {String(error)}
                </Container>
            </InputController>
        </Container>
    );
};
