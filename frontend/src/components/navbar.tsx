import { type FC } from "react";
import { LinkButton } from "./link-button";
import { Heading } from "./heading";
import { useViewport } from "../hooks/use-viewport";
import { Dropdown } from "./dropdown/dropdown";
import { DropdownButton } from "./dropdown/dropdown-button";
import { useNavigate } from "react-router";
import { useAccountStore } from "../stores/use-account-store";

export const Navbar: FC = () => {
    const { isMobile } = useViewport();
    const navigate = useNavigate();
    const { parsedToken, setToken } = useAccountStore();

    console.log(isMobile);

    return (
        <div className="w-full static left-0 flex justify-between mt-5">
            <div className="flex">
                <Heading className="!m-0" type="h4">
                    # typers
                </Heading>
                {!isMobile && (
                    <div className="flex ml-5">
                        <LinkButton border="left" to="/typing">
                            typing
                        </LinkButton>
                        <LinkButton border="both" to="/games">
                            games
                        </LinkButton>
                    </div>
                )}
            </div>
            <div>
                {parsedToken ? (
                    <Dropdown label={parsedToken.sub}>
                        <DropdownButton onClick={() => navigate("/profile")}>
                            My profile
                        </DropdownButton>
                        <DropdownButton
                            onClick={() => {
                                setToken(null);
                                navigate("/");
                            }}
                        >
                            Logout
                        </DropdownButton>
                    </Dropdown>
                ) : (
                    <LinkButton to="/login" border="both">
                        Log in
                    </LinkButton>
                )}
            </div>
        </div>
    );
};
