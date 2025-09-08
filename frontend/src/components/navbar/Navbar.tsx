import type { FC } from "react";

const Navbar: FC = () => {
    return <div className="w-screen flex justify-between p-4 border-b-white">
        <div>
            <h1>logo</h1>
        </div>
        <div>
            <h1>something else</h1>
        </div>
        <div>
            <h1>drawer</h1>
        </div>
    </div>;
};

export default Navbar;
