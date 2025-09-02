import React from "react";
import {
  Table,
  Code,
  VStack,
  Spinner,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import MyAlert from "./myChakra/MyAlert";
import { formatDateTime } from "@/utils/userFuncs";
import { Trash2 } from "lucide-react";
import { deleteLoan } from "@/utils/userActions";

const LoanTable: React.FC = () => {
  const [items, setItems] = useState<Loan[]>([]);
  const [errorStatus, setErrorStatus] = useState<"error" | "success">("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDsc, setErrorDsc] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  type Loan = {
    id: number;
    username: string;
    loan_code: string;
    start_date: string;
    end_date: string;
    take_date: string;
    returned_date: string;
    created_at: string;
    loaned_items_name: string[];
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8002/api/allLoans", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        return data;
      } catch (error) {
        setError("error", "Failed to fetch loans", "There is an error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData().then((data) => {
      if (Array.isArray(data)) {
        setItems(data);
      }
    });
  }, []);

  return (
    <>
      <Heading marginBottom={4} size="md">
        Ausleihen
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
                <strong>Besitzer</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Ausleih code</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Startdatum</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Enddatum</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Ausleihdatum</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Rückgabedatum</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Erstellt am</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Ausgeliehene Artikel</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Aktionen</strong>
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.username}</Table.Cell>
                <Table.Cell>
                  <Code>{item.loan_code}</Code>
                </Table.Cell>
                <Table.Cell>{formatDateTime(item.start_date)}</Table.Cell>
                <Table.Cell>{formatDateTime(item.end_date)}</Table.Cell>
                <Table.Cell>{formatDateTime(item.take_date)}</Table.Cell>
                <Table.Cell>{formatDateTime(item.returned_date)}</Table.Cell>
                <Table.Cell>{formatDateTime(item.created_at)}</Table.Cell>
                <Table.Cell>{item.loaned_items_name.join(", ")}</Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() =>
                      deleteLoan(item.id).then((response) => {
                        if (response.success) {
                          setItems(items.filter((i) => i.id !== item.id));
                          setError(
                            "success",
                            "Loan deleted",
                            "The loan has been successfully deleted."
                          );
                        }
                      })
                    }
                    colorPalette="red"
                    size="sm"
                    ml={2}
                  >
                    <Trash2 />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </>
  );
};

export default LoanTable;
