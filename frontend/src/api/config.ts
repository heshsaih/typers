import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useTanstackQueryClient: () => QueryClient = () => {
    const client = new QueryClient();

    return client;
};

export const useAxiosClient: () => void = () => {
    const client = axios.create({
        baseURL: import.meta.env.BASE_URL
    });


    return client;
};
