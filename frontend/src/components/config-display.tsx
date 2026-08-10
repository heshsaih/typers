import { useEffect, type FC } from "react";
import {
    TIME_PRESETS,
    useGameConfig,
    WORD_PRESETS,
} from "../hooks/use-game-config";
import { Container } from "./container";
import { Dropdown } from "./dropdown/dropdown";
import { DropdownButton } from "./dropdown/dropdown-button";
import { useInputController } from "../hooks/use-input-controller";
import { JsonDisplay } from "./json-display";
import { Button } from "./button";
import { TransparentButton } from "./transparent-button";

type ConfigDisplayProps = {
    disabled?: boolean;
};

export const ConfigDisplay: FC<ConfigDisplayProps> = ({ disabled }) => {
    const { config, setConfig } = useGameConfig();
    const { setInput, inputRef } = useInputController();

    useEffect(() => {
        setInput("");
        inputRef?.current?.focus();
    }, [config]);

    return (
        <Container
            className={`flex-row !justify-center text-3xl mt-10 mb-10 ${disabled ? "text-text-disabled" : ""}`}
        >
            <JsonDisplay
                inline
                data={{
                    type: (
                        <Dropdown
                            label={String(config.type)}
                            className={`${disabled ? "" : "border-b border-accent-primary"} inline-block`}
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
                    ),
                    amount: (
                        <Dropdown
                            label={String(config.amount)}
                            className={`${disabled ? "" : "border-b border-accent-primary"} inline-block`}
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
                    ),
                }}
            ></JsonDisplay>
        </Container>
    );
};
