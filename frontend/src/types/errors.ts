export const Errors = {
    INVALID_PASSWORD: "Typed username or password is invalid",
    UNKNOWN_ERROR: "Something unexpected happened ;_;",
} as const;

export type ErrorsKeys = keyof typeof Errors;
export type ErrorsValues = (typeof Errors)[ErrorsKeys];

export type ErrorResponse = {
    error: ErrorsValues;
};
