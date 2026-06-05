import { type FC } from "react";
import { Heading } from "./heading";
import { Caret } from "./caret";

export const Navbar: FC = () => {
    return (
        <div className="w-full static left-0 flex justify-between mt-5 mb-10">
            <div className="flex">
                <Heading className="!m-0" type="h4">
                    typers<Caret pulse></Caret>
                </Heading>
            </div>
        </div>
    );
};
