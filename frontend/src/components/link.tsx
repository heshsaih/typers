import type { AnchorHTMLAttributes, FC } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {};

export const Link: FC<LinkProps> = ({ className, style, ...rest }) => {
    return <a className={`text-accent-primary underline hover:cursor-pointer ${className}`} style={style} {...rest}></a>;
};
