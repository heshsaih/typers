import { type FC } from "react";
import { Input } from "../../components/input";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { Paragraph } from "../../components/paragraph";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/use-auth";
import { Link } from "../../components/link";

const loginSchema = z.object({
    email: z.email("Value must be a valid email"),
    password: z
        .string()
        .min(8, "Password is too short")
        .max(32, "Password is too long"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: FC = () => {
    const a = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });
    const { login } = useAuth();

    const handleSubmit = a.handleSubmit((data) => {
        login.mutate(data);
    });

    return (
        <Container>
            <Heading type="h2">Log in</Heading>
            <Paragraph className="mb-12">
                Log in to view your score and save proggress!
            </Paragraph>
            <form onSubmit={handleSubmit}>
                <Container>
                    <Input
                        {...a.register("email")}
                        error={a.formState.errors.email?.message}
                        label="E-mail"
                    ></Input>
                    <Input
                        {...a.register("password")}
                        error={a.formState.errors.password?.message}
                        label="Password"
                        type="password"
                    ></Input>
                    {login.error && (
                        <Paragraph className="text-error">{login.error}</Paragraph>
                    )}
                    <Button
                        disabled={login.isPending}
                        isPending={login.isPending}
                        type="submit"
                    >
                        Login
                    </Button>
                    <Paragraph>
                        You don't have an account yet?{" "}
                        <Link to="/register">Register now!</Link>
                    </Paragraph>
                </Container>
            </form>
        </Container>
    );
};
