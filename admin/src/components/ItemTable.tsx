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
  Icon,
  Tag,
  Input,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import MyAlert from "./myChakra/MyAlert";
import {
  Trash2,
  RefreshCcwDot,
  CirclePlus,
  CheckCircle2,
  XCircle,
  Save,
} from "lucide-react";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { deleteItem, handleEditItems } from "@/utils/userActions";
import AddItemForm from "./AddItemForm";
import { formatDateTime } from "@/utils/userFuncs";

type Items = {
  id: number;
  item_name: string;
  can_borrow_role: string;
  inSafe: boolean;
  entry_created_at: string;
};

const ItemTable: React.FC = () => {
  const [items, setItems] = useState<Items[]>([]);
  const [errorStatus, setErrorStatus] = useState<"error" | "success">("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDsc, setErrorDsc] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [addForm, setAddForm] = useState(false);

  const handleItemNameChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, item_name: value } : it))
    );
  };

  const handleCanBorrowRoleChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, can_borrow_role: value } : it))
    );
  };

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
        const response = await fetch("http://localhost:8002/api/allItems", {
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
        <Tooltip content="Gegenstände neu laden" openDelay={300}>
          <IconButton
            aria-label="Refresh items"
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

        <Tooltip content="Neuen Gegenstand hinzufügen" openDelay={300}>
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
              setAddForm(true);
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
      {addForm && (
        <AddItemForm
          onClose={() => {
            setAddForm(false);
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
              <strong>Gegenstand</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Ausleih Berechtigung</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Im Schließfach</strong>
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
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>
                <Input
                  onChange={(e) =>
                    handleItemNameChange(item.id, e.target.value)
                  }
                  value={item.item_name}
                />
              </Table.Cell>
              <Table.Cell>
                <Input
                  onChange={(e) =>
                    handleCanBorrowRoleChange(item.id, e.target.value)
                  }
                  value={item.can_borrow_role}
                />
              </Table.Cell>
              <Table.Cell>
                {item.inSafe ? (
                  <Tag.Root
                    size="md"
                    bg="green.500"
                    color="white"
                    px={4}
                    py={1.5}
                    rounded="full"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    shadow="sm"
                    _hover={{ shadow: "md" }}
                  >
                    <Icon as={CheckCircle2} boxSize={4} />
                    <Text
                      as="span"
                      fontSize="xs"
                      letterSpacing="wide"
                      textTransform="uppercase"
                    >
                      Yes
                    </Text>
                  </Tag.Root>
                ) : (
                  <Tag.Root
                    size="md"
                    bg="red.500"
                    color="white"
                    px={4}
                    py={1.5}
                    rounded="full"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    shadow="sm"
                    _hover={{ shadow: "md" }}
                  >
                    <Icon as={XCircle} boxSize={4} />
                    <Text
                      as="span"
                      fontSize="xs"
                      letterSpacing="wide"
                      textTransform="uppercase"
                    >
                      No
                    </Text>
                  </Tag.Root>
                )}
              </Table.Cell>
              <Table.Cell>{formatDateTime(item.entry_created_at)}</Table.Cell>
              <Table.Cell>
                <Button
                  onClick={() =>
                    handleEditItems(
                      item.id,
                      item.item_name,
                      item.can_borrow_role
                    ).then((response) => {
                      if (response.success) {
                        setError(
                          "success",
                          "User edited",
                          "The user has been successfully edited."
                        );
                      }
                    })
                  }
                  colorPalette="teal"
                  size="sm"
                >
                  <Save />
                </Button>
                <Button
                  onClick={() =>
                    deleteItem(item.id).then((response) => {
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

export default ItemTable;
