import { Box } from "@chakra-ui/react";

export const Footer = () => {
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
      v2.0
    </Box>
  );
};
