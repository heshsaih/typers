import type { AnchorHTMLAttributes, FC } from "react";
import { useNavigate } from "react-router";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    to?: string;
};

export const Link: FC<LinkProps> = ({
    className,
    to,
    style,
    onClick,
    ...rest
}) => {
    const navigate = useNavigate();

    return (
        <a
            onClick={(e) => {
                if (to) {
                    navigate(to);
                } else if (onClick) {
                    onClick(e);
                }
            }}
            className={`text-accent-primary underline hover:cursor-pointer ${className}`}
            style={style}
            {...rest}
        ></a>
    );
};
