import { isSession } from "react-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Role = "user" | "admin";

type JWT = {
    exp: number;
    iss: string;
    role: Role;
    sub: string;
};

type AccountStore = {
    parsedToken?: JWT | null;
    token?: string | null;
    setToken: (newToken?: string | null) => void;
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

const accountStore = create<AccountStore>()(
    persist(
        (set) => ({
            parsedToken: null,
            token: null,
            setToken: (newToken) =>
                set({ token: newToken, parsedToken: parseJWT(newToken) }),
        }),
        {
            name: "jwt",
            partialize: (state) => ({ token: state.token }),
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: (state) => {
                const token = sessionStorage.getItem("token");
                if (token) {
                    try {
                        state.token = token;
                        state.parsedToken = parseJWT(JSON.parse(token).state.token);
                    } catch (_) {
                        sessionStorage.removeItem("token");
                        state.token = null;
                        state.parsedToken = null;
                    }
                }
            },
        },
    ),
);

export const useAccountStore = () => {
    const { token, parsedToken, setToken } = accountStore();

    const isAuthenticated = !!token;
    const isAdmin = parsedToken && parsedToken.role === "admin";
    const isUser = parsedToken && parsedToken.role === "user";
    const isSessionExpired =
        parsedToken &&
        parsedToken.exp > Math.floor(new Date("2012.08.10").getTime() / 1000);

    return {
        parsedToken,
        setToken,
        isAuthenticated,
        isAdmin,
        isUser,
        isSessionExpired,
    };
};
