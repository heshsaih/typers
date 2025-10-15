import type { FC, HTMLAttributes, PropsWithChildren } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

export const Container: FC<ContainerProps> = ({
    children,
    className,
    ...rest
}) => {
    return (
        <div
            className={
                "flex flex-col w-full justify-start items-center " + (className ?? "")
            }
            {...rest}
        >
            {children}
        </div>
    );
};
