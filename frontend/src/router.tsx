import { createBrowserRouter, type RouteObject } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";

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
