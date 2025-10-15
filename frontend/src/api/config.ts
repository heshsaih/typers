import { QueryClient } from "@tanstack/react-query";
import axios, { type AxiosInstance } from "axios";

export const useTanstackQueryClient: () => QueryClient = () => {
    const client = new QueryClient();

    return client;
};

export const useAxiosClient: () => AxiosInstance  = () => {
    const client = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    axios.interceptors.request.use(
        (req) => {
            const token = localStorage.getItem("token");

            if (token) {
                req.headers.Authorization = `Bearer ${token}`;
            }

            return req;
        },
        (err) => err,
    );

    return client;
};
