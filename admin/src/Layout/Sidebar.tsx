import React from "react";
import { useEffect, useState } from "react";
import { Box, Flex, VStack, Heading, Text, Link } from "@chakra-ui/react";
import { API_BASE } from "@/config/api.config";

type SidebarProps = {
  viewAusleihen: () => void;
  viewGegenstaende: () => void;
  viewSchliessfaecher: () => void;
  viewUser: () => void;
  viewAPI: () => void;
  viewConfig: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  viewAusleihen,
  viewGegenstaende,
  viewUser,
  viewAPI,
  viewConfig
}) => {
  const [info, setInfo] = useState<any>(null);

  const fetchInfo = async () => {
    const response = await fetch(`${API_BASE}/`);
    const data = await response.json();
    setInfo(data);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <Box
      as="aside"
      w="180px"
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
          <Link
            px={3}
            py={2}
            rounded="md"
            _hover={{ bg: "gray.700", textDecoration: "none" }}
            onClick={viewConfig}
          >
            Server Konfiguration
          </Link>
        </VStack>

        <Box mt="auto" pt={8} fontSize="xs" color="gray.500">
          <Text mb={2}>&copy; Made with ❤️ by Theis Gaedigk</Text>
          {info ? (
            <Flex gap={2} wrap="wrap">
              <Box
                as="span"
                px={2}
                py={0.5}
                rounded="full"
                bg="gray.700"
                color="gray.200"
              >
                Panel {info?.["admin-panel-info"]?.version ?? "—"}
              </Box>
              <Box
                as="span"
                px={2}
                py={0.5}
                rounded="full"
                bg="gray.700"
                color="gray.200"
              >
                Backend {info?.["backend-info"]?.version ?? "—"}
              </Box>
            </Flex>
          ) : (
            <Text color="gray.600">Lade Versionsinfos…</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar;
