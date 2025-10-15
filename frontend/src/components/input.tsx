import type { FC, InputHTMLAttributes } from "react";
import { Paragraph } from "./paragraph";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export const Input: FC<InputProps> = ({ className, style, label, error, ...rest }) => {
    const border = error ? "border-error" : "border-accent-primary";

    return (
        <div className="m-1 flex flex-col">
            <label>{label}</label>
            <input
                className={`border ${border} rounded-sm p-1 ${className}`}
                style={style}
                {...rest}
            ></input>
            {error && <Paragraph className="text-error mt-0 mb-0">{error}</Paragraph>}
        </div>
    );
};
