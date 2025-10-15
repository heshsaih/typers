import type { FC } from "react";
import { Heading } from "../../components/heading";
import { Container } from "../../components/container";
import { Paragraph } from "../../components/paragraph";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useAuth } from "../../hooks/use-auth";

const registerSchema = z.object({
    username: z.string().min(4, "Username is too short"),
    password: z.string().min(8, "Password is too short"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: FC = () => {
    const a = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const { register } = useAuth();

    const handleSubmit = a.handleSubmit((data) => {
        register.mutate(data);
    });

    return (
        <Container>
            <Heading type="h2">Register</Heading>
            <Paragraph>
                Make an account to save your progress, be placed on the leaderboard and
                more!
            </Paragraph>
            <form onSubmit={handleSubmit}>
                <Container>
                    <Input
                        {...a.register("username")}
                        label="Username"
                        error={a.formState.errors.username?.message}
                    ></Input>
                    <Input
                        {...a.register("password")}
                        label="Password"
                        type="password"
                        error={a.formState.errors.password?.message}
                    ></Input>
                    <Button isPending={register.isPending} disabled={register.isPending} type="submit">Register</Button>
                </Container>
            </form>
        </Container>
    );
};
