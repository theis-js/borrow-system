import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Spinner, Text, VStack, Box } from "@chakra-ui/react";
import { Table, Heading } from "@chakra-ui/react";
import { formatDateTime } from "@/utils/userFuncs";

const Landingpage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8002/apiV2/allLoans")
      .then((response) => response.json())
      .then((data) => {
        setLoans(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching loans:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Heading as="h1" size="lg" mb={4}>
        Matthias-Claudius-Schule Technik
      </Heading>
      <Heading as="h2" size="md" mb={4}>
        Alle Ausleihen
      </Heading>
      {isLoading && (
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      )}
      {!isLoading && (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
          bg="white"
          _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        >
          <Box maxH="70vh" overflow="auto">
            <Table.Root
              size="md"
              variant="outline"
              colorPalette="teal"
              w="full"
              minW="900px"
            >
              <Table.ColumnGroup>
                <Table.Column htmlWidth="50%" />
                <Table.Column htmlWidth="40%" />
                <Table.Column />
              </Table.ColumnGroup>
              <Table.Header
                position="sticky"
                top={0}
                zIndex={1}
                bg="gray.50"
                _dark={{ bg: "gray.700" }}
              >
                <Table.Row>
                  <Table.ColumnHeader
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    color="gray.600"
                    _dark={{ color: "gray.200" }}
                    py={3}
                  >
                    <strong>#</strong>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    color="gray.600"
                    _dark={{ color: "gray.200" }}
                    py={3}
                  >
                    <strong>Username</strong>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    color="gray.600"
                    _dark={{ color: "gray.200" }}
                    py={3}
                  >
                    <strong>Start Date</strong>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    color="gray.600"
                    _dark={{ color: "gray.200" }}
                    py={3}
                  >
                    <strong>End Date</strong>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    color="gray.600"
                    _dark={{ color: "gray.200" }}
                    py={3}
                  >
                    <strong>Loaned Items</strong>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    color="gray.600"
                    _dark={{ color: "gray.200" }}
                    py={3}
                  >
                    <strong>Returned Date</strong>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    color="gray.600"
                    _dark={{ color: "gray.200" }}
                    py={3}
                  >
                    <strong>Take Date</strong>
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {loans.map((loan) => (
                  <Table.Row
                    key={loan.id}
                    _hover={{ bg: "gray.50", _dark: { bg: "whiteAlpha.100" } }}
                    transition="background-color 120ms ease"
                  >
                    <Table.Cell py={3} fontWeight="semibold">
                      {loan.id}
                    </Table.Cell>
                    <Table.Cell py={3}>{loan.username}</Table.Cell>
                    <Table.Cell
                      py={3}
                      whiteSpace="nowrap"
                      fontFamily="mono"
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                    >
                      {formatDateTime(loan.start_date)}
                    </Table.Cell>
                    <Table.Cell
                      py={3}
                      whiteSpace="nowrap"
                      fontFamily="mono"
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                    >
                      {formatDateTime(loan.end_date)}
                    </Table.Cell>
                    <Table.Cell
                      py={3}
                      maxW="40ch"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {loan.loaned_items_name}
                    </Table.Cell>
                    <Table.Cell
                      py={3}
                      whiteSpace="nowrap"
                      fontFamily="mono"
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                    >
                      {formatDateTime(loan.returned_date)}
                    </Table.Cell>
                    <Table.Cell
                      py={3}
                      whiteSpace="nowrap"
                      fontFamily="mono"
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                    >
                      {formatDateTime(loan.take_date)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Landingpage;
