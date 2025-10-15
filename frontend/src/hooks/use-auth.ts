import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "../api/config";

type LoginRequest = {
    username: string;
    password: string;
};

export const useAuth = () => {
    const client = useAxiosClient();

    const login = useMutation({
        mutationFn: async (payload: LoginRequest) => {
            const response = await client.post("/auth/login", payload);
            return response.headers.getAuthorization;
        },
        onSuccess: (token) => {
            if (token) {
                localStorage.setItem("token", JSON.stringify(token));
            }
        },
    });

    return {
        login,
    };
};
