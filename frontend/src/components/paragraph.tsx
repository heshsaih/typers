import type { FC, HTMLAttributes } from "react";

type ParagraphProps = HTMLAttributes<HTMLParagraphElement> & {};

export const Paragraph: FC<ParagraphProps> = ({
    className,
    style,
    ...rest
}) => {
    return <p className={`text-center my-4 ${className}`} style={style} {...rest}></p>;
};
