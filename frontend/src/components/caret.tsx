import { type FC } from "react";

type CaretProps = {
    pulse?: boolean;
};

export const Caret: FC<CaretProps> = ({ pulse }) => {
    return (
        <span
            className={`outline-accent-primary outline-2 ${pulse ? "animate-pulse" : ""}`}
        ></span>
    );
};
