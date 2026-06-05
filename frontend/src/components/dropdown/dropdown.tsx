import {
    Children,
    cloneElement,
    isValidElement,
    useEffect,
    useRef,
    useState,
    type FC,
    type HTMLAttributes,
} from "react";
import { TransparentButton } from "../transparent-button";

type DropdownProps = HTMLAttributes<HTMLDivElement> & {
    label?: string;
    disabled?: boolean;
};

export const Dropdown: FC<DropdownProps> = ({
    children,
    className,
    style,
    label,
    disabled,
    ...rest
}) => {
    const [open, setOpen] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const a = (event: MouseEvent) => {
            if (listRef.current && buttonRef.current) {
                if (
                    !(
                        listRef.current.contains(event.target as Node) ||
                        buttonRef.current.contains(event.target as Node)
                    )
                ) {
                    setOpen(false);
                }
            }
        };

        window.addEventListener("mouseup", a);

        return () => window.removeEventListener("mouseup", a);
    }, []);

    const childrenWithProps = Children.map(children, (child) => {
        if (isValidElement(child)) {
            return cloneElement(child, {
                //@ts-ignore
                onClick: (e) => {
                    //@ts-ignore
                    if (child.props.onClick) {
                        //@ts-ignore
                        child.props.onClick(e);
                    }
                    setOpen(false);
                },
            });
        }
        return child;
    });

    return (
        <div className={`h-full ${className ?? ""}`} style={style} {...rest}>
            <TransparentButton
                changeOnHover={!disabled}
                className="h-full"
                ref={buttonRef}
                onClick={() => !disabled && setOpen(!open)}
            >
                {label}
            </TransparentButton>
            {open && (
                <div
                    ref={listRef}
                    className="fixed bg-background-primary border border-accent-primary border-text-text rounded-sm"
                >
                    <ul>{childrenWithProps}</ul>
                </div>
            )}
        </div>
    );
};
