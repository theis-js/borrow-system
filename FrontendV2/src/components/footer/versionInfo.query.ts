import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/config/api.config";

export const useVersionInfoQuery = () =>
  useQuery({
    queryKey: ["versionInfo"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/server-info`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return {
          "backend-info": {
            version: "N/A",
          },
          "frontend-info": {
            version: "N/A",
          },
        };
      }
    },
  });
