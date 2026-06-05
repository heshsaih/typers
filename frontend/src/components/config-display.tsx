import type { FC } from "react";
import { TIME_PRESETS, useGameConfig, WORD_PRESETS } from "../hooks/use-game";
import { Container } from "./container";
import { Dropdown } from "./dropdown/dropdown";
import { DropdownButton } from "./dropdown/dropdown-button";

type ConfigDisplayProps = {
    disabled?: boolean;
};

export const ConfigDisplay: FC<ConfigDisplayProps> = ({ disabled }) => {
    const { config, setConfig } = useGameConfig();

    return (
        <Container
            className={`flex-row !justify-center text-3xl mt-10 mb-10 ${disabled ? "text-text-disabled" : ""}`}
        >
            <span className="text-text-disabled">&#123;&#160;</span>
            <span>"type":&#160;</span>
            <Dropdown
                label={`"${config.type}"`}
                className={disabled ? "" : "border-b border-accent-primary"}
                disabled={disabled}
            >
                <DropdownButton
                    onClick={() => !disabled && setConfig({ type: "time" })}
                >
                    time
                </DropdownButton>
                <DropdownButton
                    onClick={() => !disabled && setConfig({ type: "words" })}
                >
                    words
                </DropdownButton>
            </Dropdown>
            <span>,&#160;"amount":&#160;</span>
            <Dropdown
                label={`"${config.amount}"`}
                className={disabled ? "" : "border-b border-accent-primary"}
                disabled={disabled}
            >
                {(config.type === "words" ? WORD_PRESETS : TIME_PRESETS).map(
                    (value) => (
                        <DropdownButton onClick={() => setConfig({ amount: value })}>
                            {value}
                        </DropdownButton>
                    ),
                )}
            </Dropdown>
            <span className="text-text-disabled">&#160;&#125;</span>
        </Container>
    );
};
