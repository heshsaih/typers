import type { FC, Ref } from "react";

type CursorProps = {
    ref?: Ref<HTMLSpanElement>;
};

export const Cursor: FC<CursorProps> = ({ ref }) => {
    return (
        <span
            ref={ref}
            className="absolute -translate-x-2 animate-pulse text-text transition-opacity duration-500 ease-out"
        >
            &#124;
        </span>
    );
};
