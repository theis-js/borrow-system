import React from "react";
import {
  Table,
  Spinner,
  Text,
  VStack,
  Button,
  HStack,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import MyAlert from "./myChakra/MyAlert";
import {
  Trash2,
  RefreshCcwDot,
  CirclePlus,
} from "lucide-react";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import {
  deleteItem,
} from "@/utils/userActions";
import AddItemForm from "./AddItemForm";
import { formatDateTime } from "@/utils/userFuncs";

type Items = {
  id: number;
  apiKey: string;
  user: string;
  entry_created_at: string;
};

const APIKeyTable: React.FC = () => {
  const [items, setItems] = useState<Items[]>([]);
  const [errorStatus, setErrorStatus] = useState<"error" | "success">("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDsc, setErrorDsc] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [addAPIForm, setAddAPIForm] = useState(false);

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
        const response = await fetch("http://localhost:8002/api/keys", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        return data;
      } catch (error) {
        setError("error", "Failed to fetch items", "There is an error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData().then((data) => {
      if (Array.isArray(data)) {
        setItems(data);
      }
    });
  }, [reload]);

  return (
    <>
      {/* Action toolbar */}
      <HStack
        mb={4}
        gap={3}
        justify="flex-start"
        align="center"
        flexWrap="wrap"
      >
        <Tooltip content="API Keys neu laden" openDelay={300}>
          <IconButton
            aria-label="Refresh API Keys"
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

        <Tooltip content="Neuen API Key hinzufügen" openDelay={300}>
          <Button
            size="sm"
            colorPalette="teal"
            variant="solid"
            rounded="md"
            fontWeight="semibold"
            shadow="sm"
            _hover={{ shadow: "md", bg: "colorPalette.600" }}
            _active={{ bg: "colorPalette.700" }}
            onClick={() => {
              setAddAPIForm(true);
            }}
          >
            <CirclePlus size={18} style={{ marginRight: 6 }} />
            Neuen Gegenstand hinzufügen
          </Button>
        </Tooltip>
      </HStack>
      {/* End action toolbar */}

      <Heading marginBottom={4} size="md">
        Gegenstände
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
      {addAPIForm && (
        <AddItemForm
          onClose={() => {
            setAddAPIForm(false);
            setReload(!reload);
          }}
          alert={setError}
        />
      )}

      <Table.Root size="sm" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <strong>#</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>API Key</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Benutzer</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Eintrag erstellt am</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Aktionen</strong>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((apiKey) => (
            <Table.Row key={apiKey.id}>
              <Table.Cell>{apiKey.id}</Table.Cell>
              <Table.Cell>{apiKey.apiKey}</Table.Cell>
              <Table.Cell>
                <Table.Cell>{apiKey.user}</Table.Cell>
              </Table.Cell>
              <Table.Cell>{formatDateTime(apiKey.entry_created_at)}</Table.Cell>
              <Table.Cell>
                <Button
                  onClick={() =>
                    deleteItem(apiKey.id).then((response) => {
                      if (response.success) {
                        setItems(items.filter((i) => i.id !== apiKey.id));
                        setError(
                          "success",
                          "Gegenstand gelöscht",
                          "Der Gegenstand wurde erfolgreich gelöscht."
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
    </>
  );
};

export default APIKeyTable;
