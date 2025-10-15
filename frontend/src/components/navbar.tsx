import type { FC } from "react";
import { LinkButton } from "./link-button";
import { Heading } from "./heading";
import { useViewport } from "../hooks/use-viewport";

export const Navbar: FC = () => {
    const { isMobile } = useViewport();

    return (
        <div className="w-full static top-0 left-0 mb-5 p-1 flex justify-between px-6 pb-2 border-b border-accent-secondary">
            <div className="flex justify-center w-fit">
                <LinkButton to="/" changeOnHover={false}>
                    <Heading style={{ margin: 0 }} type="h4">Typers</Heading>
                </LinkButton>
            </div>
            {!isMobile && (
                <>
                    <div className="flex justify-start w-full display-none">
                        <LinkButton to="/" border="both">
                            Typing
                        </LinkButton>
                    </div>
                    <div className="display-none flex w-fit">
                        <LinkButton to="/login" border="both">
                            Log in
                        </LinkButton>
                    </div>
                </>
            )}
        </div>
    );
};
