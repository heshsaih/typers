import type { FC } from "react";
import { LinkButton } from "./link-button";
import { Heading } from "./heading";
import { useViewport } from "../hooks/use-viewport";
import { parseJWT } from "../util";

export const Navbar: FC = () => {
    const { isMobile } = useViewport();
    const token = parseJWT(localStorage.getItem("token"));

    return (
        <div className="w-full static top-0 left-0 mb-5 p-1 flex justify-between px-6 pb-2 border-b border-accent-secondary">
            <div className="flex justify-center w-fit">
                <LinkButton to="/" changeOnHover={false}>
                    <Heading style={{ margin: 0 }} type="h4">
                        Typers
                    </Heading>
                </LinkButton>
            </div>
            {!isMobile && (
                <div className="w-full flex justify-between display-none">
                    <div className="flex">
                        <LinkButton to="/" border="left">
                            Typing
                        </LinkButton>
                        <LinkButton to="/" border="both">
                            Games
                        </LinkButton>
                    </div>
                    <LinkButton to="/login" border="both">
                        {token ? token.sub : "Log in"}
                    </LinkButton>
                </div>
            )}
        </div>
    );
};
