import type { FC } from "react";
import { Outlet } from "react-router";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Container } from "../components/container";

export const DefaultLayout: FC = () => {
    return (
        <Container className="min-h-screen">
            <Container className="container min-h-8/12">
                <Navbar></Navbar>
                <Outlet></Outlet>
            </Container>
            <Footer></Footer>
        </Container>
    );
};
