import { createBrowserRouter, type RouteObject } from "react-router";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/login";
import { DefaultLayout } from "./layouts/default-layout";

const routes: RouteObject[] = [
    {
        path: "/",
        Component: DefaultLayout,
        children: [
            {
                path: "/",
                Component: HomePage,
            },
            {
                path: "/login",
                Component: LoginPage,
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
