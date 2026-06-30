import { useAxiosClient } from "../api/config";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Errors, type ErrorsKeys } from "../types";
import { useAccountStore } from "./use-account";

export const Role = {
    USER_ROLE: 0,
    ADMIN_ROLE: 1,
    MANAGER_ROLE: 2,
} as const;

export type RoleType = typeof Role;

export type JWT = {
    exp: number;
    iat: number;
    iss: string;
    role: RoleType;
    sub: string;
};

export const parseJWT = (token: string | undefined | null): JWT | null => {
    if (!token) {
        return null;
    }

    if (!token.startsWith("Bearer ")) {
        return null;
    }

    const content = token.split(" ")[1].split(".");

    if (content.length != 3) {
        return null;
    }

    const claims = content[1];

    try {
        const parsedClaims = decodeURIComponent(window.atob(claims));
        return JSON.parse(parsedClaims);
    } catch (_) {
        return null;
    }
};

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
