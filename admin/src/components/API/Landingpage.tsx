import React, { useEffect, useState } from "react";
import {
  Spinner,
  Text,
  VStack,
  Table,
  Heading,
  HStack,
  Card,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { Lock, LockOpen } from "lucide-react";
import MyAlert from "../myChakra/MyAlert";
import { formatDateTime } from "@/utils/userFuncs";

type Loan = {
  id: number;
  username: string;
  start_date: string;
  end_date: string;
  returned_date: string | null;
  take_date: string | null;
  loaned_items_name: string[] | string;
};

type Device = {
  id: number;
  item_name: string;
  can_borrow_role: string;
  inSafe: number;
  entry_created_at: string;
};

const Landingpage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState<"error" | "success">("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDsc, setErrorDsc] = useState("");

  const setError = (
    status: "error" | "success",
    message: string,
    description: string
  ) => {
    setIsError(false);
    setErrorStatus(status);
    setErrorMessage(message);
    setErrorDsc(description);
    setIsError(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const loanRes = await fetch("http://localhost:8002/apiV2/allLoans");
        const loanData = await loanRes.json();
        if (Array.isArray(loanData)) {
          setLoans(loanData);
        } else {
          setError(
            "error",
            "Fehler beim Laden",
            "Unerwartetes Datenformat erhalten. (Ausleihen)"
          );
        }

        const deviceRes = await fetch("http://localhost:8002/apiV2/allItems");
        const deviceData = await deviceRes.json();
        if (Array.isArray(deviceData)) {
          setDevices(deviceData);
        } else {
          setError(
            "error",
            "Fehler beim Laden",
            "Unerwartetes Datenformat erhalten. (Geräte)"
          );
        }
      } catch (e) {
        setError(
          "error",
          "Fehler beim Laden",
          "Die Ausleihen konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Heading as="h1" size="lg" mb={2}>
        Matthias-Claudius-Schule Technik
      </Heading>

      <Heading as="h2" size="md" mb={4}>
        Alle Ausleihen
      </Heading>

      {isError && (
        <MyAlert
          status={errorStatus}
          description={errorDsc}
          title={errorMessage}
        />
      )}

      {isLoading && (
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      )}

      {!isLoading && (
        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>
                <strong>#</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Benutzername</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Startdatum</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Enddatum</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Ausgeliehene Artikel</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Rückgabedatum</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Ausleihdatum</strong>
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {loans.map((loan) => (
              <Table.Row key={loan.id}>
                <Table.Cell>{loan.id}</Table.Cell>
                <Table.Cell>{loan.username}</Table.Cell>
                <Table.Cell>{formatDateTime(loan.start_date)}</Table.Cell>
                <Table.Cell>{formatDateTime(loan.end_date)}</Table.Cell>
                <Table.Cell>
                  {Array.isArray(loan.loaned_items_name)
                    ? loan.loaned_items_name.join(", ")
                    : loan.loaned_items_name}
                </Table.Cell>
                <Table.Cell>{formatDateTime(loan.returned_date)}</Table.Cell>
                <Table.Cell>{formatDateTime(loan.take_date)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {!isLoading && loans.length === 0 && !isError && (
        <Text color="gray.500" mt={2}>
          Keine Ausleihen vorhanden.
        </Text>
      )}

      <Heading as="h2" size="md" mb={4}>
        Alle Geräte
      </Heading>

      {/* Responsive Grid mit gleich hohen Karten */}
      <SimpleGrid minChildWidth="200px" gap={2} alignItems="stretch">
        {devices.map((device) => (
          <Card.Root
            key={device.id}
            size="sm"
            bg={device.inSafe ? "green" : "red"}
            h="full"
            minH="100px"
          >
            <Card.Header>
              {device.inSafe ? <LockOpen size={16} /> : <Lock size={16} />}
              <Heading size="md">{device.item_name}</Heading>
            </Card.Header>
            <Card.Body color="fg.muted">
              <Text>Ausleihrolle: {device.can_borrow_role}</Text>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
      <HStack mt={3} gap={3} align="center" role="group" aria-label="Legende">
        <Text fontWeight="medium" color="fg.muted">
          Legende:
        </Text>
        <Button
          size="sm"
          variant="subtle"
          colorPalette="green"
          pointerEvents="none"
          cursor="default"
          borderRadius="full"
        >
          <HStack gap={2}>
            <LockOpen size={16} />
            <Text>Im Schließfach</Text>
          </HStack>
        </Button>
        <Button
          size="sm"
          variant="subtle"
          colorPalette="red"
          pointerEvents="none"
          cursor="default"
          borderRadius="full"
        >
          <HStack gap={2}>
            <Lock size={16} />
            <Text>Nicht im Schließfach</Text>
          </HStack>
        </Button>
      </HStack>
    </>
  );
};

export default Landingpage;
