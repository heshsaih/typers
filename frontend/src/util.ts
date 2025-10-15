import type { RoleType } from "./types/role";

type JWT = {
    exp: number;
    iat: number;
    iss: string;
    role: RoleType;
    sub: string;
};

export const parseJWT = (token: string | undefined): JWT | null => {
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
