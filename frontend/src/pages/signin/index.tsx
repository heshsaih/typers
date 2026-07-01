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
import { Link } from "../../components/link";

const registerSchema = z.object({
    email: z.email("Value must be a valid e-mail"),
    username: z
        .string()
        .min(5, "Username is too short")
        .max(32, "Username is too long"),
    password: z
        .string()
        .min(8, "Password is too short")
        .max(32, "Password is too long"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const SignInPage: FC = () => {
    const a = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const { signIn } = useAuth();

    const handleSubmit = a.handleSubmit((data) => {
        signIn.mutate(data);
    });

    return (
        <Container>
            <Heading type="h2">Sign in</Heading>
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
                        {...a.register("email")}
                        label="E-mail"
                        error={a.formState.errors.email?.message}
                    ></Input>
                    <Input
                        {...a.register("password")}
                        label="Password"
                        type="password"
                        error={a.formState.errors.password?.message}
                    ></Input>
                    <Button
                        isPending={signIn.isPending}
                        disabled={signIn.isPending}
                        type="submit"
                    >
                        Register
                    </Button>
                    <Paragraph>
                        Already have an accout? <Link to="/login">Log in!</Link>
                    </Paragraph>
                </Container>
            </form>
        </Container>
    );
};
