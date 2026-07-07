import { createBrowserRouter, type RouteObject } from "react-router";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/login";
import { DefaultLayout } from "./layouts/default-layout";
import { TypingPage } from "./pages/typing";
import { GamesPage } from "./pages/games";
import { ProfilePage } from "./pages/profile";
import { SignInPage } from "./pages/signin";

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
            {
                path: "/typing",
                Component: TypingPage,
            },
            {
                path: "/games",
                Component: GamesPage,
            },
            {
                path: "/signin",
                Component: SignInPage
            },
            {
                path: "profile",
                Component: ProfilePage,
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
