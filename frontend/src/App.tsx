import type { FC } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTanstackQueryClient } from "./api/config";

export const App: FC = () => {
    const client = useTanstackQueryClient();

    return <QueryClientProvider client={client}>
        <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
};
