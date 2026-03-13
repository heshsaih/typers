import { type FC } from "react";
import { TransparentButton } from "../../components/transparent-button";
import { Heading } from "../../components/heading";

export type ConfigParams = {
    gameType: "words" | "time";
    amount: number;
};

type ConfigurationBarProps = {
    config: ConfigParams;
    setConfig: (config: ConfigParams) => void;
    isPlaying: boolean;
};

const timeButtons: ConfigParams[] = [
    {
        gameType: "time",
        amount: 15,
    },
    {
        gameType: "time",
        amount: 30,
    },
    {
        gameType: "time",
        amount: 60,
    },
    {
        gameType: "time",
        amount: 120,
    },
];

const wordsButtons: ConfigParams[] = [
    {
        gameType: "words",
        amount: 15,
    },
    {
        gameType: "words",
        amount: 30,
    },
    {
        gameType: "words",
        amount: 45,
    },
    {
        gameType: "words",
        amount: 60,
    },
];

export const ConfigurationBar: FC<ConfigurationBarProps> = ({
    config,
    setConfig,
    isPlaying,
}) => {
    return (
        <div className={`flex my-5 ${isPlaying ? "invisible" : ""}`}>
            <div className="flex-col">
                <Heading className="text-center" type="h6">
                    Time
                </Heading>
                <div>
                    {timeButtons.map((button, i) => (
                        <TransparentButton
                            border={i === timeButtons.length - 1 ? "both" : "left"}
                            onClick={() => setConfig(button)}
                            className={
                                button.amount === config.amount &&
                                    button.gameType === config.gameType
                                    ? "bg-accent-primary"
                                    : ""
                            }
                        >
                            {button.amount + "s"}
                        </TransparentButton>
                    ))}
                </div>
            </div>
            <div className="flex-col">
                <Heading className="text-center" type="h6">
                    Words
                </Heading>
                <div>
                    {wordsButtons.map((button, i) => (
                        <TransparentButton
                            border={i === wordsButtons.length - 1 ? "both" : "left"}
                            onClick={() => setConfig(button)}
                            className={
                                button.amount === config.amount &&
                                    button.gameType === config.gameType
                                    ? "bg-accent-primary"
                                    : ""
                            }
                        >
                            {button.amount + "w"}
                        </TransparentButton>
                    ))}
                </div>
            </div>
        </div>
    );
};
