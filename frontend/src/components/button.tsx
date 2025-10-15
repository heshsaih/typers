import type { ButtonHTMLAttributes, FC } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {};

export const Button: FC<ButtonProps> = ({ className, style, ...rest }) => {
    return (
        <button
            className={`bg-accent-primary hover:bg-accent-secondary hover:cursor-pointer rounded-sm px-3 py-1 m-1 ${className}`}
            style={style}
            {...rest}
        ></button>
    );
};
