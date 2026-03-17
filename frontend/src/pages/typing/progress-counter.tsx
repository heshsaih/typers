import type { FC, PropsWithChildren } from "react";
import { Heading } from "../../components/heading";

type ProgressCounterProps = PropsWithChildren;

export const ProgressCounter: FC<ProgressCounterProps> = ({ children }) => {
    return (
        <div>
            <Heading className="text-text-disabled" type="h1">
                {children}
            </Heading>
        </div>
    );
};
