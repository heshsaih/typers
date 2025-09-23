import type { FC, HTMLAttributes, JSX } from "react"

type HeadingType = "h1" | "h2" | "h3" | "h4";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
    type: HeadingType;
};

const headingVariants: Record<HeadingType, { element: JSX.Element, size: string }> = {
    "h1": {
        element: <h1></h1>,
        size: "48px"
    },
    "h2": {
        element: <h2></h2>,
        size: "32px"
    },
    "h3": {
        element: <h3></h3>,
        size: "24px"
    },
    "h4": {
        element: <h4></h4>,
        size: "16px"
    }
};

export const Heading: FC<HeadingProps> = ({ type, ...rest }) => {
};
