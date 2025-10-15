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

const loginSchema = z.object({
    username: z.string().min(4, "Username is too short"),
    password: z.string().min(8, "Password is too short"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: FC = () => {
    const a = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });
    const {login} = useAuth();

    const handleSubmit = a.handleSubmit((data) => {
        console.log(data);
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
                        {...a.register("username")}
                        error={a.formState.errors.username?.message}
                        name="username"
                        label="Username"
                    ></Input>
                    <Input
                        {...a.register("password")}
                        name="password"
                        error={a.formState.errors.password?.message}
                        label="Password"
                        type="password"
                    ></Input>
                    <Button type="submit">Login</Button>
                </Container>
            </form>
        </Container>
    );
};
