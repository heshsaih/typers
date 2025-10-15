import type { FC, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
};

export const Input: FC<InputProps> = ({ className, style, label, ...rest }) => {
    return (
        <div className="m-1 flex flex-col">
            <label>{label}</label>
            <input
                className={`border border-accent-primary focus:outline-focus rounded-sm p-1 ${className}`}
                style={style}
                {...rest}
            ></input>
        </div>
    );
};
