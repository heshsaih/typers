import {
    createElement,
    type CSSProperties,
    type FC,
    type HTMLAttributes,
} from "react";

type HeadingType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
    type: HeadingType;
};

const defaultHeadingStyles: Record<HeadingType, CSSProperties> = {
    h1: {
        fontSize: "64px",
        fontWeight: "700",
        margin: "0 0 1rem 0",
        lineHeight: 1.2,
    },
    h2: {
        fontSize: "48px",
        fontWeight: "700",
        margin: "0 0 0.875rem 0",
        lineHeight: 1.3,
    },
    h3: {
        fontSize: "40px",
        fontWeight: "600",
        margin: "0 0 0.75rem 0",
        lineHeight: 1.4,
    },
    h4: {
        fontSize: "32px",
        fontWeight: "600",
        margin: "0 0 0.75rem 0",
        lineHeight: 1.4,
    },
    h5: {
        fontSize: "24px",
        fontWeight: "500",
        margin: "0 0 0.5rem 0",
        lineHeight: 1.5,
    },
    h6: {
        fontSize: "16px",
        fontWeight: "500",
        margin: "0 0 0.5rem 0",
        lineHeight: 1.5,
    },
};

export const Heading: FC<HeadingProps> = ({
    type,
    style,
    className,
    ...rest
}) => {
    const headingType: HeadingType = Object.keys(defaultHeadingStyles).includes(
        type,
    )
        ? type
        : "h1";
    const styles = defaultHeadingStyles[type];

    return createElement(headingType, {
        className: `${className}`,
        style: {
            ...styles,
            ...style,
        },
        ...rest,
    });
};
