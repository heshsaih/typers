import { useAxiosClient } from "../api/config";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "./use-account";
import type { AxiosError } from "axios";

type LoginRequest = {
    email: string;
    password: string;
};

type RegisterRequest = {
    email: string;
    username: string;
    password: string;
};

export const useAuth = () => {
    const client = useAxiosClient();
    const navigate = useNavigate();
    const { setToken } = useAccountStore();

    const login = useMutation({
        mutationFn: async (payload: LoginRequest) => {
            const response = await client.post("/auth/login", payload);
            //@ts-ignore
            return response.headers.getAuthorization();
        },
        onSuccess: (token: string) => {
            setToken(token);
        },
        onError: (error: AxiosError<{error: string}>) => {
            return error.response?.data.error;
        }
    });

    const signIn = useMutation({
        mutationFn: async (payload: RegisterRequest) => {
            const response = await client.post("/auth/signin", payload);
            //@ts-ignore
            return response.headers.getAuthorization();
        },
        onSuccess: (token: string) => {
            setToken(token);
            navigate("/typing");
        },
    });

    return {
        login,
        signIn,
    };
};
