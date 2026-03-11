import type { FC, HTMLAttributes } from "react";

type DropdownButtonProps = HTMLAttributes<
    HTMLLIElement & HTMLButtonElement
> & {};

export const DropdownButton: FC<DropdownButtonProps> = ({
    className,
    style,
    children,
    onClick,
    ...rest
}) => {
    return (
        <li
            className={`rounded-xs hover:bg-accent-secondary ${className}`}
            style={style}
            {...rest}
        >
            <button className="px-4 py-2 hover:cursor-pointer" onClick={onClick}>
                {children}
            </button>
        </li>
    );
};
