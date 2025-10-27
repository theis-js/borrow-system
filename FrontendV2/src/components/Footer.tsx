import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { infoAtom } from "@/states/Atoms";
import { useAtom } from "jotai";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const Footer = () => {
  const [info, setInfo] = useAtom(infoAtom);

  useEffect(() => {
    const metaData = async () => {
      const response = await fetch(`${API_BASE}/server-info`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setInfo(data);
      }
    };
    metaData();
  }, []);

  return (
    <Box
      as="footer"
      py={4}
      textAlign="center"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
    >
      Made with ❤️ by Theis Gaedigk - Year 2019 at MCS-Bochum
      <br />
      Frontend-Version: {info ? info["frontend-info"].version : "N/A"} |
      Backend-Version: {info ? info["backend-info"].version : "N/A"}
    </Box>
  );
};
