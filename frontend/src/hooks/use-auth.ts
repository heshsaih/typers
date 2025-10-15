import { useQuery } from "@tanstack/react-query"

export const useAuth = () => {
    const login = useQuery({
        queryKey: ["login"],
        enabled: false,
        queryFn: async () => {
        }
    });


}
