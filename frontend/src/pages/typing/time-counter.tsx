import { useEffect, useState, type FC } from "react";
import { Heading } from "../../components/heading";

type TimeCounterProps = {
    initialTime: number;
    isPlaying: boolean;
    finishLoop: () => void;
};

export const TimeCounter: FC<TimeCounterProps> = ({
    initialTime,
    isPlaying,
    finishLoop,
}) => {
    const [elapsed, setElapsed] = useState<number>(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        let interval = 0;
        if (isPlaying) {
            setStartTime(new Date().getTime());
            interval = setInterval(() => {
                const delta = (new Date().getTime() - (startTime ?? 0)) / 1000;
                setElapsed(delta);
                if (initialTime - delta < 0) {
                    finishLoop();
                }
            }, 100);
        }

        return () => {
            if (isPlaying) {
                clearInterval(interval);
                setStartTime(null);
            }
        };
    }, [isPlaying, startTime]);

    return (
        <div>
            <Heading className="text-text-disabled" type="h1">
                {Math.ceil(initialTime - elapsed)} {!isPlaying && "seconds"}
            </Heading>
        </div>
    );
};
