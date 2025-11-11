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
import { Trash2, RefreshCcwDot, CirclePlus } from "lucide-react";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { deleteAPKey } from "@/utils/userActions";
import AddAPIKey from "./AddAPIKey";
import { formatDateTime } from "@/utils/userFuncs";
import { API_BASE } from "@/config/api.config";

type Items = {
  id: number;
  api_key: string;
  entry_name: string;
  entry_created_at: string;
  last_used_at: string | null;
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
        const response = await fetch(
          `${API_BASE}/api/admin/api-data/get-api-keys`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
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
            Neuen API Key hinzufügen
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
        <AddAPIKey
          onClose={() => {
            setAddAPIForm(false);
            setReload(!reload);
          }}
          alert={setError}
        />
      )}

      <Table.Root
        size="sm"
        striped
        w="100%"
        // table-layout: auto => Spaltenbreite nach Content; volle Breite nutzen
        style={{ tableLayout: "auto" }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader width="1%" whiteSpace="nowrap">
              <strong>#</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>API Key</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Name</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader whiteSpace="nowrap">
              <strong>Eintrag erstellt am</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader whiteSpace="nowrap">
              <strong>Zuletzt benutzt am</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader width="1%" whiteSpace="nowrap">
              <strong>Aktionen</strong>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell whiteSpace="nowrap">{item.id}</Table.Cell>
              <Table.Cell fontFamily="mono">{item.api_key}</Table.Cell>
              <Table.Cell>{item.entry_name}</Table.Cell>
              <Table.Cell whiteSpace="nowrap">
                {formatDateTime(item.entry_created_at)}
              </Table.Cell>
              <Table.Cell whiteSpace="nowrap">
                {!item.last_used_at
                  ? "Nie benutzt"
                  : formatDateTime(item.last_used_at)}
              </Table.Cell>
              <Table.Cell whiteSpace="nowrap">
                <Button
                  onClick={() =>
                    deleteAPKey(item.id).then((response) => {
                      if (response.success) {
                        setItems(items.filter((i) => i.id !== item.id));
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
