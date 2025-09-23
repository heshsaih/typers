import type { FC } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router";

export const App: FC = () => {
    return <RouterProvider router={router}></RouterProvider>;
};
