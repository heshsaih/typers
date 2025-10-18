import { create } from "zustand";
import type { JWT } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";
import { parseJWT } from "../util";

type AccountStore = {
    token: JWT | null;
    setToken: (newToken: JWT | null) => void;
};

export const useAccountStore = create<AccountStore>()(
    persist(
        (set) => ({
            token: null,
            setToken: (newToken) => set({ token: newToken }),
        }),
        {
            name: "token",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: (state) => {
                state.token = parseJWT(localStorage.getItem("token"));
            },
        },
    ),
);
