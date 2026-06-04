import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export function useFamily() {
  const { api,isPending:loading } = useAuth();
  return useQuery({
    queryKey: ["family"],
    queryFn: async () => {
      const res = await api.get("/family/");
      return res.data.family ?? [];
    },
    staleTime: 1000 * 60 * 10, // family data changes less often
    enabled: !loading,
  });
}
