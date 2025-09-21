import React, { useEffect, useState } from "react";
import {
  Spinner,
  Text,
  VStack,
  Table,
  Heading,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { RefreshCcwDot } from "lucide-react";
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

const Landingpage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState<"error" | "success">("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDsc, setErrorDsc] = useState("");
  const [reload, setReload] = useState(false);

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
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8002/apiV2/allLoans");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLoans(data);
        } else {
          setError(
            "error",
            "Fehler beim Laden",
            "Unerwartetes Datenformat erhalten."
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
    fetchLoans();
  }, [reload]);

  return (
    <>
      <Heading as="h1" size="lg" mb={2}>
        Matthias-Claudius-Schule Technik
      </Heading>

      {/* Action toolbar */}
      <HStack
        mb={4}
        gap={3}
        justify="flex-start"
        align="center"
        flexWrap="wrap"
      >
        <Tooltip content="Ausleihen neu laden" openDelay={300}>
          <IconButton
            aria-label="Refresh loans"
            size="sm"
            variant="outline"
            rounded="md"
            shadow="sm"
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            _active={{ transform: "translateY(0)" }}
            onClick={() => setReload(!reload)}
          >
            <RefreshCcwDot size={18} />
          </IconButton>
        </Tooltip>
      </HStack>
      {/* End action toolbar */}

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
    </>
  );
};

export default Landingpage;
