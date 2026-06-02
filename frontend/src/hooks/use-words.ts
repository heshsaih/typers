import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../api/config";

type WordsApiResponse = {
    words: string[];
};

export const useWords = () => {
    const client = useAxiosClient();
    const query = useQuery({
        queryKey: ["wordsApi"],
        queryFn: async () => {
            const response = await client.get<WordsApiResponse>("/typing/words");
            return response.data;
        },
    });

    return { ...query };
};
