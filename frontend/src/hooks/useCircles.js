import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export function useCircles() {
  const { api,loading } = useAuth();
  return useQuery({
    queryKey: ["circles"],
    queryFn: async () => {
      const res = await api.get("/circle/my-circles");
      return res.data.circles ?? [];
    },
    staleTime: 1000 * 60 * 10, // circles change less often
    enabled: !loading,
  });
}
