import type { ButtonHTMLAttributes, FC } from "react";
import { Spinner } from "./spinner";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isPending?: boolean;
};

export const Button: FC<ButtonProps> = ({
    className,
    style,
    children,
    isPending,
    disabled,
    ...rest
}) => {
    const classesBasedOnDisabled = disabled
        ? "bg-accent-secondary text-text-disabled"
        : "bg-accent-primary hover:bg-accent-secondary hover:cursor-pointer";
    return (
        <button
            className={`${classesBasedOnDisabled} rounded-sm px-3 py-1 m-1 ${className}`}
            style={style}
            {...rest}
            children={isPending ? <Spinner></Spinner> : children}
            disabled={disabled}
        ></button>
    );
};
