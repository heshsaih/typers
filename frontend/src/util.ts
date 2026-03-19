import type { JWT } from "./types";

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

export const isTypedCharacterAllowed = (char: string): boolean => {
    if (char.length !== 1) return false;
    const code = char.charCodeAt(0);
    //small character, big character or the "-" dash
    return (code > 64 && code < 91) || (code > 96 && code < 123) || code === 45;
};

// clamps a given number to a given range [min, max]
export const clamp = (number: number, min: number, max: number): number => {
    return Math.max(min, Math.min(number, max));
};
