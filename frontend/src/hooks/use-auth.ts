import { useAxiosClient } from "../api/config";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAccountStore } from "../stores/use-account-store";
import { Errors, type ErrorsKeys } from "../types";

type LoginRequest = {
    username: string;
    password: string;
};

type RegisterRequest = {
    username: string;
    password: string;
};

export const useAuth = () => {
    const client = useAxiosClient();
    const navigate = useNavigate();
    const { setToken } = useAccountStore();

    const login = useMutation({
        mutationFn: async (payload: LoginRequest) => {
            try {
                const response = await client.post("/auth/login", payload);
                //@ts-ignore
                return response.headers.getAuthorization() as string | undefined;
            } catch (e) {
                if (e instanceof AxiosError) {
                    throw Errors[e.response?.data.error as ErrorsKeys];
                }
                throw Errors.UNKNOWN_ERROR;
            }
        },
        onSuccess: (token) => {
            setToken(token);
            navigate("/typing");
        },
    });

    const register = useMutation({
        mutationFn: async (payload: RegisterRequest) => {
            await client.post("/auth/register", payload);
        },
        onSuccess: () => {
            navigate("/login");
        },
    });

    return {
        login,
        register,
    };
};
