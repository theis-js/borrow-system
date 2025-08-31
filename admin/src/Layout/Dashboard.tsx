import React from "react";
import { useState } from "react";
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import UserTable from "../components/UserTable";
import ItemTable from "../components/ItemTable";
import LockerTable from "../components/LockerTable";
import LoanTable from "../components/LoanTable";
import { MoveLeft } from "lucide-react";

type DashboardProps = {
  onLogout?: () => void;
};

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const userName = localStorage.getItem("userName") || "Admin";

  const [activeView, setActiveView] = useState("");

  return (
    <Flex h="100vh">
      <Sidebar
        viewAusleihen={() => setActiveView("Ausleihen")}
        viewGegenstaende={() => setActiveView("Gegenstände")}
        viewSchliessfaecher={() => setActiveView("Schließfächer")}
        viewUser={() => setActiveView("User")}
      />
      <Box flex="1" display="flex" flexDirection="column">
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
          <Heading size="md">Dashboard</Heading>
          <Flex align="center" gap={6}>
            <Text fontSize="sm" color="white">
              Willkommen {userName}, im Admin-Dashboard!
            </Text>
            <Button variant="solid" onClick={onLogout}>
              Logout
            </Button>
          </Flex>
        </Flex>
        <Box as="main" flex="1" p={6}>
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
          {activeView === "Schließfächer" && <LockerTable />}
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
