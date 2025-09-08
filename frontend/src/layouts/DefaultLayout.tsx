import type { FC } from "react";
import { Outlet } from "react-router";
import Container from "../components/Container";
import Navbar from "../components/navbar/Navbar";

const DefaultLayout: FC = () => {
    return (
        <div className="w-screen flex-col h-screen flex justify-start items-center bg-gray-800">
            <Navbar></Navbar>
            <Container className="container mt-5">
                <Outlet></Outlet>
            </Container>
        </div>
    );
};

export default DefaultLayout;
