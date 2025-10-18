import { create } from "zustand";
import type { JWT } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";
import { parseJWT } from "../util";

type AccountStore = {
    parsedToken?: JWT | null;
    token?: string | null;
    setToken: (newToken?: string | null) => void;
};

export const useAccountStore = create<AccountStore>()(
    persist(
        (set) => ({
            parsedToken: null,
            token: null,
            setToken: (newToken) =>
                set({ token: newToken, parsedToken: parseJWT(newToken) }),
        }),
        {
            name: "token",
            partialize: (state) => ({ token: state.token }),
            storage: createJSONStorage(() => sessionStorage),
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
