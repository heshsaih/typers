import type { FC } from "react";
import { Paragraph } from "./paragraph";

export const Footer: FC =() => {
    return <div>
        <footer className="text-text-disabled">
            <Paragraph>@ 2025 - typers.pro</Paragraph>
        </footer>
    </div>
}
