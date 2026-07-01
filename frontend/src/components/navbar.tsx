import { type FC } from "react";
import { Heading } from "./heading";
import { Caret } from "./caret";
import { useAccountStore } from "../hooks/use-account";
import { TransparentButton } from "./transparent-button";

export const Navbar: FC = () => {
    const { isAuthenticated, parsedToken } = useAccountStore();
    return (
        <div className="w-full static left-0 flex justify-between mt-5 mb-10">
            <div className="flex">
                <Heading className="!m-0" type="h4">
                    typers<Caret pulse></Caret>
                </Heading>
            </div>
            <div className="flex">
                {isAuthenticated ? (
                    <span>{parsedToken?.sub}</span>
                ) : (
                    <TransparentButton>Log in</TransparentButton>
                )}
            </div>
        </div>
    );
};
