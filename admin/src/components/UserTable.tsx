import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Spinner,
  Text,
  VStack,
  Button,
  Input,
  HStack,
  IconButton,
  Heading,
  Switch, // neu
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { fetchUserData } from "@/utils/fetcher";
import { Save, Trash2, RefreshCcwDot, CirclePlus } from "lucide-react";
import { handleDelete, handleEdit } from "@/utils/userActions";
import MyAlert from "./myChakra/MyAlert";
import AddForm from "./AddForm";
import { formatDateTime } from "@/utils/userFuncs";
import ChangePWform from "./ChangePWform";

type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  role: number;
  entry_created_at: string;
  entry_updated_at: string;
};

const UserTable: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState<"error" | "success">("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDsc, setErrorDsc] = useState("");
  const [reload, setReload] = useState(false);
  const [addForm, setAddForm] = useState(false);
  const [changePWform, setChangePWform] = useState(false);
  const [changeUsr, setChangeUsr] = useState("");

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

  const handleInputChange = (userId: number, field: string, value: any) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              [field]:
                field === "role"
                  ? Number(value)
                  : field === "is_admin"
                  ? value === true || value === "true" || value === 1
                  : value,
            }
          : user
      )
    );
  };

  const handlePasswordChange = (username: string) => {
    setChangeUsr(username);
    setChangePWform(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserData();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError(
            "error",
            "Failed to load users",
            "Invalid data format received"
          );
        }
      } catch (e) {
        console.error("Failed to fetch users", e);
        if (e instanceof Error) {
          setError(
            "error",
            "Failed to fetch users",
            e.message || "Unknown error"
          );
        } else {
          setError("error", "Failed to fetch users", "Unknown error");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
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
        <Tooltip content="Benutzer neu laden" openDelay={300}>
          <IconButton
            aria-label="Refresh users"
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

        <Tooltip content="Neuen Nutzer hinzufügen" openDelay={300}>
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
            Neuen Nutzer hinzufügen
          </Button>
        </Tooltip>
      </HStack>
      {/* End action toolbar */}

      <Heading marginBottom={4} size="2xl">
        Benutzer
      </Heading>
      {changePWform && (
        <ChangePWform
          onClose={() => {
            setChangePWform(false);
            setReload(!reload);
          }}
          alert={setError}
          username={changeUsr}
        />
      )}
      {isError && (
        <MyAlert
          status={errorStatus}
          description={errorDsc}
          title={errorMessage}
        />
      )}
      {addForm && (
        <AddForm
          onClose={() => {
            setAddForm(false);
            setReload(!reload);
          }}
          alert={setError}
        />
      )}
      {isLoading && (
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      )}
      {!isLoading && (
        <Table.Root
          size="sm"
          striped
          w="100%"
          style={{ tableLayout: "auto" }} // Spalten nach Content
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader width="1%" whiteSpace="nowrap">
                <strong>#</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Benutzername</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Vorname</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Nachname</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>E-Mail</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader width="1%" whiteSpace="nowrap">
                <strong>Admin</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">
                <strong>Passwort ändern</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader width="1%" whiteSpace="nowrap">
                <strong>Rolle</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">
                <strong>Eintrag erstellt am</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">
                <strong>Eintrag aktualisiert am</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader width="1%" whiteSpace="nowrap">
                <strong>Aktionen</strong>
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell whiteSpace="nowrap">{user.id}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>
                  <Input
                    size="sm"
                    value={user.first_name ?? ""}
                    onChange={(e) =>
                      handleInputChange(user.id, "first_name", e.target.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <Input
                    size="sm"
                    value={user.last_name ?? ""}
                    onChange={(e) =>
                      handleInputChange(user.id, "last_name", e.target.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <Input
                    type="email"
                    size="sm"
                    value={user.email ?? ""}
                    onChange={(e) =>
                      handleInputChange(user.id, "email", e.target.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  <Switch.Root
                    size="sm"
                    checked={!!user.is_admin}
                    onCheckedChange={(d) =>
                      handleInputChange(user.id, "is_admin", d.checked)
                    }
                    aria-label="Adminrechte umschalten"
                  >
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.HiddenInput />
                  </Switch.Root>
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  <Button
                    size="sm"
                    onClick={() => handlePasswordChange(user.username)}
                  >
                    Passwort ändern
                  </Button>
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  <Input
                    type="number"
                    size="sm"
                    onChange={(e) =>
                      handleInputChange(user.id, "role", e.target.value)
                    }
                    value={user.role}
                    width="70px"
                  />
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  {formatDateTime(user.entry_created_at)}
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  {formatDateTime(user.entry_updated_at)}
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  <Button
                    onClick={() =>
                      handleEdit(
                        user.id,
                        user.first_name,
                        user.last_name,
                        user.email,
                        user.is_admin,
                        Number(user.role)
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
                      handleDelete(user.id).then((response) => {
                        if (response.success) {
                          setUsers(users.filter((u) => u.id !== user.id));
                          setError(
                            "success",
                            "User deleted",
                            "The user has been successfully deleted."
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

export default UserTable;
