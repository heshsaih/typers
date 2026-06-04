import type { FC } from "react";
import { Outlet } from "react-router";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Container } from "../components/container";

export const DefaultLayout: FC = () => {
    return (
        <Container className="">
            <Container className="container min-h-[75vh]">
                <Navbar></Navbar>
                <Outlet></Outlet>
            </Container>
            <Footer></Footer>
        </Container>
    );
};
