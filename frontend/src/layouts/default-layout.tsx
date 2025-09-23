import type { FC } from "react";
import { Outlet } from "react-router";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Container } from "../components/container";

export const DefaultLayout: FC = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Container className="container h-48 w-screen">
                <Outlet></Outlet>
            </Container>
            <Footer></Footer>
        </div>
    );
};
