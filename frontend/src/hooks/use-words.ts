import { useState } from "react";
import { useAxiosClient } from "../api/config";

export type GetWordsParams = {
    amount: number;
};

type GetWordsResponse = {
    words: string[];
};

export const useWords = () => {
    const client = useAxiosClient();
    const [words, setWords] = useState<string[] | null>(null);

    const getWords = async (params: GetWordsParams) => {
        setWords(null);
        const response = await client.get<GetWordsResponse>("/typing/words", {
            params: params,
        });

        setWords(response.data.words);
    };

    return {
        getWords,
        words,
    };
};
