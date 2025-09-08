import { type ComponentProps, type FC, type PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren & ComponentProps<'div'> & {};

const Container: FC<ContainerProps> = ({ children, className, ...rest }) => {
    return (
        <div className={"flex flex-col justify-center items-center " + className} {...rest}>
            {children}
        </div>
    );
};

export default Container;
