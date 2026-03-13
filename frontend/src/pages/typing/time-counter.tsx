import { useEffect, useState, type FC } from "react";
import { Heading } from "../../components/heading";

type TimeCounterProps = {
    initialTime: number;
    isPlaying: boolean;
};

export const TimeCounter: FC<TimeCounterProps> = ({
    initialTime,
    isPlaying,
}) => {
    const [elapsed, setElapsed] = useState<number>(0);
    const [startTime, setStartTime] = useState<number>(new Date().getTime());

    useEffect(() => {
        let interval = 0;
        if (isPlaying) {
            setStartTime(new Date().getTime());
            interval = setInterval(() => {
                setElapsed((new Date().getTime() - startTime) / 1000);
            }, 100);
        }

        return () => {
            if (isPlaying) {
                clearInterval(interval);
            }
        };
    }, [isPlaying]);

    return (
        <div>
            <Heading className="text-text-disabled" type="h1">
                {Math.ceil(initialTime - elapsed)}
            </Heading>
        </div>
    );
};
