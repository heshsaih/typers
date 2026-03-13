import type { FC, InputHTMLAttributes } from "react";
import { Paragraph } from "./paragraph";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    fullWidth?: boolean;
};

export const Input: FC<InputProps> = ({
    fullWidth,
    className,
    style,
    label,
    error,
    ...rest
}) => {
    const border = error ? "border-error" : "border-text-text";

    return (
        <div className={`m-1 flex flex-col ${fullWidth ? "w-full" : ""}`}>
            <label>{label}</label>
            <input
                className={`border ${border} rounded-sm p-1 focus:outline ${className}`}
                style={style}
                {...rest}
            ></input>
            {error && <Paragraph className="text-error mt-0 mb-0">{error}</Paragraph>}
        </div>
    );
};
