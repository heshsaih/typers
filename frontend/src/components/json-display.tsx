import { type FC } from "react";
import { Container } from "./container";

type JsonDisplayProps = {
    data?: object;
};

function renderObject(obj: object, indent: number) { 
    return <>
        <span>&#123;</span>
            {Object.keys(obj).map(key => (
                <span>{[...Array(indent).keys()].map(() => <>&#160;</>)}&#34;{key}&#34;</span>
            ))}
        <span>&#125;</span>
    </>
}

export const JsonDisplay: FC<JsonDisplayProps> = ({ data }) => {
    return (
        <Container>
            <div className="flex flex-col">
                {renderObject(data, 2)}
            </div>
        </Container>
    );
};
