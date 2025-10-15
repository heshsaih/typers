import type { ButtonHTMLAttributes, FC } from "react";
import { useNavigate } from "react-router";

type BorderType = "left" | "right" | "both" | "none";

type LinkButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    border?: BorderType;
    to: string;
    changeOnHover?: boolean;
};

export const LinkButton: FC<LinkButtonProps> = ({
    border,
    style,
    className,
    changeOnHover = true,
    to,
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
    const navigate = useNavigate();

    return (
        <button
            className={`${changeOnHover ? "hover:bg-accent-secondary" : ""} cursor-pointer ${borderClass} border-accent-primary px-7 ${className ?? ""}`}
            onClick={() => navigate(to)}
            style={{ ...style }}
            {...rest}
        ></button>
    );
};
