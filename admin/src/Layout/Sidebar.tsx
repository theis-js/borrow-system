import React from "react";
import { Box, Flex, VStack, Heading, Text, Link } from "@chakra-ui/react";

type SidebarProps = {
  viewAusleihen: () => void;
  viewGegenstaende: () => void;
  viewSchliessfaecher: () => void;
  viewUser: () => void;
  viewAPI: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  viewAusleihen,
  viewGegenstaende,
  viewUser,
  viewAPI,
}) => {
  return (
    <Box
      as="aside"
      w="260px"
      minH="100vh"
      bg="gray.800"
      color="gray.100"
      px={6}
      py={8}
      borderRight="1px solid"
      borderColor="gray.700"
    >
      <Flex direction="column" h="full">
        <Heading size="md" mb={8} letterSpacing="wide">
          Borrow System
        </Heading>

        <VStack align="stretch" gap={4} fontSize="sm">
          <Link
            px={3}
            py={2}
            rounded="md"
            _hover={{ bg: "gray.700", textDecoration: "none" }}
            onClick={viewUser}
          >
            Benutzer
          </Link>
          <Link
            px={3}
            py={2}
            rounded="md"
            _hover={{ bg: "gray.700", textDecoration: "none" }}
            onClick={viewAusleihen}
          >
            Ausleihen
          </Link>
          <Link
            px={3}
            py={2}
            rounded="md"
            _hover={{ bg: "gray.700", textDecoration: "none" }}
            onClick={viewGegenstaende}
          >
            Gegenstände
          </Link>
          <Link
            px={3}
            py={2}
            rounded="md"
            _hover={{ bg: "gray.700", textDecoration: "none" }}
            onClick={viewAPI}
          >
            API Keys
          </Link>
        </VStack>

        <Box mt="auto" pt={8} fontSize="xs" color="gray.500">
          <Text>&copy; Made with ❤️ by Theis Gaedigk</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar;
