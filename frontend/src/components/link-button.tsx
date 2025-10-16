import type { FC } from "react";
import { useNavigate } from "react-router";
import {
    TransparentButton,
    type TransparentButtonProps,
} from "./transparent-button";

type LinkButtonProps = TransparentButtonProps & {
    to: string;
};

export const LinkButton: FC<LinkButtonProps> = ({
    to,
    className,
    style,
    ...rest
}) => {
    const navigate = useNavigate();

    return (
        <TransparentButton
            onClick={() => navigate(to)}
            className={`${className}`}
            style={style}
            {...rest}
        ></TransparentButton>
    );
};
