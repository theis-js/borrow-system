import React from "react";
import {
  Table,
  Spinner,
  Text,
  VStack,
  Heading,
  Switch,
} from "@chakra-ui/react";
import MyAlert from "./myChakra/MyAlert";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { formatDateTime } from "@/utils/userFuncs";
import { API_BASE } from "@/config/api.config";

type Items = {
  id: number;
  function_name: string;
  active: boolean;
  entry_created_at: string;
  updated_at: string | null;
};

const ServerConfig: React.FC = () => {
  const [items, setItems] = useState<Items[]>([]);
  const [errorStatus, setErrorStatus] = useState<"error" | "success">("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDsc, setErrorDsc] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const handleSwitchChange = async (id: number, newState: boolean) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/admin/server-config/update?functionName=${encodeURIComponent(
          items.find((item) => item.id === id)?.function_name || "",
        )}&active=${newState}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      if (response.ok) {
        setReload((prev) => !prev);
        setError(
          "success",
          "Status updated",
          "The function status was updated successfully.",
        );
      } else {
        setError(
          "error",
          "Failed to update status",
          "There is an error updating the function status.",
        );
      }
    } catch (error) {
      setError(
        "error",
        "Failed to update status",
        "There is an error updating the function status.",
      );
    }
  };

  const setError = (
    status: "error" | "success",
    message: string,
    description: string,
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
          `${API_BASE}/api/admin/server-config/all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          },
        );
        const data = await response.json();
        return data.data;
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
      <Heading marginBottom={4} size="2xl">
        Server Konfiguration
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

      <Table.Root size="sm" striped w="100%" style={{ tableLayout: "auto" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader width="1%" whiteSpace="nowrap">
              <strong>#</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Service Name</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Toggle</strong>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <strong>Eintrag erstellt am</strong>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell whiteSpace="nowrap">{item.id}</Table.Cell>
              <Table.Cell fontFamily="mono">{item.function_name}</Table.Cell>
              <Table.Cell>
                <Switch.Root
                  checked={item.active}
                  onCheckedChange={() =>
                    handleSwitchChange(item.id, !item.active)
                  }
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Label />
                </Switch.Root>
              </Table.Cell>
              <Table.Cell whiteSpace="nowrap">
                {formatDateTime(item.entry_created_at)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default ServerConfig;
