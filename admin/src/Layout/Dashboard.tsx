import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import UserTable from "../components/UserTable";
import ItemTable from "../components/ItemTable";
import LoanTable from "../components/LoanTable";
import APIKeyTable from "@/components/APIKeyTable";
import ServerConfig from "@/components/ServerConfig";
import { MoveLeft } from "lucide-react";

type DashboardProps = {
  onLogout?: () => void;
};

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const userName = localStorage.getItem("userName") || "Admin";

  const [activeView, setActiveView] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.location.pathname.slice(1);
    if (raw) {
      setActiveView(decodeURIComponent(raw));
    }
  }, []);

  // Sync URL when activeView changes, without reloading
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!activeView) return;
    const desired = `/${encodeURIComponent(activeView)}`;
    if (window.location.pathname !== desired) {
      window.history.replaceState(null, "", desired);
    }
  }, [activeView]);

  return (
    <Flex h="100vh">
      <Sidebar
        viewAusleihen={() => setActiveView("Ausleihen")}
        viewGegenstaende={() => setActiveView("Gegenstände")}
        viewSchliessfaecher={() => setActiveView("Schließfächer")}
        viewUser={() => setActiveView("User")}
        viewAPI={() => setActiveView("API")}
        viewConfig={() => setActiveView("Server Konfiguration")}
      />
      <Box flex="1" display="flex" flexDirection="column" minH={0}>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          px={6}
          py={4}
          borderBottom="1px"
          borderColor="gray.200"
          bg="gray.900"
        >
          <Heading size="xl">Dashboard</Heading>
          <Flex align="center" gap={6}>
            <Text fontSize="sm" color="white">
              Willkommen {userName}, im Admin-Dashboard!
            </Text>
            <Button variant="solid" onClick={onLogout}>
              Logout
            </Button>
          </Flex>
        </Flex>
        <Box as="main" flex="1" p={6} minH={0} overflow="hidden">
          {activeView === "" && (
            <Flex
              align="center"
              gap={3}
              p={4}
              border="1px dashed"
              borderColor="gray.300"
              borderRadius="md"
              bg="gray.50"
              color="gray.700"
              fontSize="lg"
              fontWeight="semibold"
            >
              <MoveLeft size={20} />
              Bitte wählen Sie eine Ansicht aus.
            </Flex>
          )}
          {activeView === "User" && <UserTable />}
          {activeView === "Ausleihen" && <LoanTable />}
          {activeView === "Gegenstände" && <ItemTable />}
          {activeView === "API" && <APIKeyTable />}
          {activeView === "Server Konfiguration" && <ServerConfig />}
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
