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

export const isTokenExpired = (token?: JWT | null) => {
    if (!token) {
        return true;
    }
    const now = Math.floor(new Date().getTime() / 1000);
    return now > token.exp;
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
            setToken: (newToken) => {
                const parsed = parseJWT(newToken);
                if (parsed) {
                    set({
                        token: newToken,
                        parsedToken: parsed,
                    });
                } else {
                    set({
                        token: null,
                        parsedToken: null,
                    });
                }
            },
        }),
        {
            name: "jwt",
            partialize: (state) => ({ token: state.token }),
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: (state) => {
                const storage = localStorage.getItem("jwt");
                if (storage == null) {
                    return;
                }
                let parsedStorage: { state: { token: string | null } } | null = null;
                try {
                    parsedStorage = JSON.parse(storage);
                } catch (_) {
                    return;
                }

                if (
                    parsedStorage === null ||
                    !parsedStorage.state ||
                    !parsedStorage.state.token
                ) {
                    return;
                }

                const parsedToken = parseJWT(parsedStorage.state.token);
                if (isTokenExpired(parsedToken)) {
                    state.token = null;
                    state.parsedToken = null;
                } else {
                    state.token = parsedStorage.state.token;
                    state.parsedToken = parsedToken;
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
    const isSessionExpired = isTokenExpired(parsedToken);

    return {
        token,
        parsedToken,
        setToken,
        isAuthenticated,
        isAdmin,
        isUser,
        isSessionExpired,
    };
};
