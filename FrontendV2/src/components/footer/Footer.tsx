import { Box } from "@chakra-ui/react";
import { useVersionInfoQuery } from "./versionInfo.query";

export const Footer = () => {
  const { data: info } = useVersionInfoQuery();

  return (
    <Box
      as="footer"
      py={4}
      textAlign="center"
      width="100%"
      flexShrink={0}
      fontSize="sm"
    >
      Made with ❤️ by Theis Gaedigk - Class of 2019 at MCS-Bochum
      <br />
      Frontend-Version: {info ? info["frontend-info"].version : "N/A"} |
      Backend-Version: {info ? info["backend-info"].version : "N/A"}
    </Box>
  );
};
