import "@tanstack/react-query";
import type { ErrorsValues } from "./errors";

declare module "@tanstack/react-query" {
    interface Register {
        defaultError: ErrorsValues
    }
}
