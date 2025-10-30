import { Box } from "@chakra-ui/react";
import { useVersionInfoQuery } from "./versionInfo.query";

export const Footer = () => {
  const { data: info } = useVersionInfoQuery();

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
