import { isValidElement, type FC, type JSX } from "react";

type JsonDisplayProps = {
    data?: object;
    inline?: boolean;
    label?: string;
};

function renderIndent(indent: number): JSX.Element {
    return (
        <>
            {new Array(indent).fill(" ").map((_) => (
                <>&#160;</>
            ))}
        </>
    );
}

function determineAction(
    key: string,
    value: any,
    indent: number,
    inline: boolean,
) {
    if (isValidElement(value)) {
        return renderElement(key, value, indent);
    }

    indent = inline ? 1 : indent;

    switch (typeof value) {
        case "string":
            return renderString(key, value, indent);
        case "number":
            return renderNumber(key, value, indent);
        case "boolean":
            return renderBoolean(key, value, indent);
        case "object":
            return value === null
                ? renderNull(key, indent)
                : renderObject(key, value, indent, inline);
        default:
            return renderUnsupported(key, indent);
    }
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
    if (key === null) {
        return (
            <div className={`flex ${inline ? "" : "flex-col"}`}>
                {Object.keys(obj).map((key) =>
                    determineAction(key, obj[key as keyof typeof obj], indent, inline),
                )}
            </div>
        );
    }

    return (
        <div className={`flex ${inline ? "" : "flex-col"}`}>
            <span>
                {renderIndent(indent)}"{key}": &#123;
            </span>
            {Object.keys(obj).map((key) =>
                determineAction(key, obj[key as keyof typeof obj], indent + 2, inline),
            )}
            <span>{renderIndent(indent)}&#125;</span>
        </div>
    );
}

export const JsonDisplay: FC<JsonDisplayProps> = ({ data, inline = false, label }) => {
    return (
        <div className="m-5">
            {label && <span className="text-text-disabled text-xl">{label}</span>}
            <div className={`flex ${inline ? "" : "flex-col"} ml-4 mt-2 text-2xl`}>
                <span className="text-text-disabled">&#123;</span>
                {data && renderObject(null, data, 2, inline)}
                {inline && renderIndent(1)}
                <span className="text-text-disabled">&#125;</span>
            </div>
        </div>
    );
};
