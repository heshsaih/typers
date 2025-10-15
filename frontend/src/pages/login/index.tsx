import { type FC } from "react";
import { Input } from "../../components/input";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { Paragraph } from "../../components/paragraph";
import { Button } from "../../components/button";

export const LoginPage: FC = () => {
    return (
        <Container>
            <Heading type="h2">Log in</Heading>
            <Paragraph className="mb-12">Log in to view your score and save proggress!</Paragraph>
            <Input label="Username"></Input>
            <Input label="Password"></Input>
            <Button onClick={() => alert("Sigma")}>Login</Button>
        </Container>
    );
};
