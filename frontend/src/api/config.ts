import { QueryClient } from "@tanstack/react-query";
import axios, { type AxiosInstance } from "axios";
import { useAccountStore } from "../hooks/use-account";

export const useTanstackQueryClient: () => QueryClient = () => {
    const client = new QueryClient();

    return client;
};

export const useAxiosClient: () => AxiosInstance = () => {
    const client = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });
    const { token } = useAccountStore();

    client.interceptors.request.use(
        (req) => {
            if (token) {
                req.headers.Authorization = `Bearer ${token}`;
            }
            return req;
        },
        (err) => err
    );

    return client;
};
