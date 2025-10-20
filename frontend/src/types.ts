export type JWT = {
    exp: number;
    iat: number;
    iss: string;
    role: RoleType;
    sub: string;
};

export const Errors = {
    INVALID_PASSWORD: "Typed username or password is invalid",
    UNKNOWN_ERROR: "Something unexpected happened ;_;",
} as const;
export type ErrorsKeys = keyof typeof Errors;
export type ErrorsValues = (typeof Errors)[ErrorsKeys];

export type ErrorResponse = {
    error: ErrorsValues;
};

export const Role = {
    USER_ROLE: 0,
    ADMIN_ROLE: 1,
    MANAGER_ROLE: 2,
} as const;

export type RoleType = typeof Role;

export const SessionMessage = {
    AUTH: "AUTH",
    WORD: "WORD"
} as const;
export type SessionMessageTypeKeys = keyof typeof SessionMessage;
export type SessionMessageTypeValues =
    (typeof SessionMessage)[SessionMessageTypeKeys];

export const USER_UNAUTHENTICATED = "UNAUTHENTICATED" as const;

export type SessionMessageType = {
    messageType: SessionMessageTypeValues;
    data: any;
};
