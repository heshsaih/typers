import { isValidElement, type FC, type JSX } from "react";

type JsonDisplayProps = {
    data?: object;
    inline?: boolean;
    label?: string;
};

function renderIndent(indent: number): string {
    return "\u00A0".repeat(indent)
}

function determineAction(
    key: string,
    value: any,
    indent: number,
    inline: boolean,
    lastElement: boolean,
): JSX.Element {
    if (isValidElement(value)) {
        return (
            <>
                {renderElement(key, value, indent)}
                {!lastElement && ","}
            </>
        );
    }

    indent = inline ? 1 : indent;
    let action: JSX.Element;

    switch (typeof value) {
        case "string":
            action = renderString(key, value, indent);
            break;
        case "number":
            action = renderNumber(key, value, indent);
            break;
        case "boolean":
            action = renderBoolean(key, value, indent);
            break;
        case "object":
            action =
                value === null
                    ? renderNull(key, indent)
                    : renderObject(key, value, indent, inline);
            break;
        default:
            action = renderUnsupported(key, indent);
    }

    return (
        <>
            {action}
            {!lastElement && <span className="text-text-disabled">, </span>}
        </>
    );
}

function renderElement(
    key: string,
    element: JSX.Element,
    indent: number,
): JSX.Element {
    return (
        <span>
            {renderIndent(indent)}"{key}"
            <span className="text-accent-primary">: </span>"{element}"
        </span>
    );
}

function renderString(key: string, str: string, indent: number): JSX.Element {
    return (
        <span>
            {renderIndent(indent)}"{key}"
            <span className="text-accent-primary">: </span>"{str}"
        </span>
    );
}

function renderNumber(key: string, num: number, indent: number): JSX.Element {
    return (
        <span>
            {renderIndent(indent)}"{key}"
            <span className="text-accent-primary">: </span>
            {num}
        </span>
    );
}

function renderNull(key: string, indent: number): JSX.Element {
    return (
        <span>
            {renderIndent(indent)}"{key}"
            <span className="text-accent-primary">: </span>null
        </span>
    );
}

function renderBoolean(
    key: string,
    bool: boolean,
    indent: number,
): JSX.Element {
    return (
        <span>
            {renderIndent(indent)}"{key}"
            <span className="text-accent-primary">: </span>
            {bool ? "true" : "false"}
            {bool}
        </span>
    );
}

function renderUnsupported(key: string, indent: number): JSX.Element {
    return (
        <span>
            {renderIndent(indent)}"{key}"
            <span className="text-accent-primary">:</span>unsupported :(
        </span>
    );
}

function renderObject(
    key: string | null,
    obj: object,
    indent: number,
    inline: boolean,
): JSX.Element {
    const keys = Object.keys(obj);
    if (key === null) {
        return (
            <div className={`flex ${inline ? "" : "flex-col"}`}>
                {keys.map((key, index) => (
                    <span>
                        {determineAction(
                            key,
                            obj[key as keyof typeof obj],
                            indent,
                            inline,
                            index === keys.length - 1,
                        )}
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div className={`flex ${inline ? "" : "flex-col"}`}>
            <span>
                {renderIndent(indent)}"{key}": &#123;
            </span>
            {keys.map((key, index) => (
                <span>
                    {determineAction(
                        key,
                        obj[key as keyof typeof obj],
                        indent + 2,
                        inline,
                        index === keys.length - 1,
                    )}
                </span>
            ))}
            <span>{renderIndent(indent)}&#125;</span>
        </div>
    );
}

export const JsonDisplay: FC<JsonDisplayProps> = ({
    data,
    inline = false,
    label,
}) => {
    return (
        <div className="m-5">
            {label && (
                <span className="text-text-disabled text-xl font-extrabold">
                    {label}
                </span>
            )}
            <div className={`flex ${inline ? "" : "flex-col"} ml-4 mt-2 text-2xl`}>
                <span className="text-text-disabled">&#123;</span>
                {data && renderObject(null, data, 2, inline)}
                {inline && renderIndent(1)}
                <span className="text-text-disabled">&#125;</span>
            </div>
        </div>
    );
};
