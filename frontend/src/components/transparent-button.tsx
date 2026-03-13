import type { ButtonHTMLAttributes, FC, RefObject } from "react";

type BorderType = "left" | "right" | "both" | "none";

export type TransparentButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    border?: BorderType;
    changeOnHover?: boolean;
    ref?: RefObject<any>;
};

export const TransparentButton: FC<TransparentButtonProps> = ({
    border,
    style,
    className,
    changeOnHover = true,
    ...rest
}) => {
    const borderClass: string = (() => {
        switch (border) {
            case "left":
                return "border-l";
            case "right":
                return "border-r";
            case "both":
                return "border-x";
            default:
                return "border-one";
        }
    })();

    return (
        <button
            className={`${changeOnHover ? "hover:bg-accent-secondary" : ""} h-full cursor-pointer ${borderClass} border-background-secondary px-6 ${className ?? ""}`}
            style={{ ...style }}
            {...rest}
        ></button>
    );
};
