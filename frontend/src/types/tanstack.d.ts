import "@tanstack/react-query";
import "../types";

declare module "@tanstack/react-query" {
    interface Register {
        defaultError: {
            error: string;
        };
    }
}
