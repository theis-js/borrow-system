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
  Container,
} from "@chakra-ui/react";
import MyAlert from "@/components/myChakra/MyAlert";
import { useTranslation } from "react-i18next";
import { API_BASE } from "@/config/api.config";
import Cookies from "js-cookie";
import { Header } from "@/components/Header";

export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "N/A";
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return "N/A";
  const [, y, M, d, h, min] = m;
  return `${d}.${M}.${y} ${h}:${min} Uhr`;
};

type Loan = {
  id: number;
  username: string;
  start_date: string;
  end_date: string;
  returned_date: string | null;
  take_date: string | null;
  loaned_items_name: string[] | string;
  note: string | null;
};

type Device = {
  id: number;
  item_name: string;
  can_borrow_role: string;
  in_safe: number;
  entry_created_at: string;
  last_borrowed_person: string | null;
  currently_borrowing: string | null;
};

const Landingpage: React.FC = () => {
  const { t } = useTranslation();

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
        const loanRes = await fetch(`${API_BASE}/api/loans/all-loans`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        if (loanRes.status === 503) {
          setError(
            "error",
            t("serviceDeactivatedHeadline"),
            t("loan_page_serviceDeactivatedText"),
          );
          setIsLoading(false);
          return;
        }

        const loanData = await loanRes.json();
        if (Array.isArray(loanData)) {
          setLoans(loanData);
        } else {
          setError(
            "error",
            t("error-by-loading"),
            t("unexpected-date-format_loan"),
          );
        }

        const deviceRes = await fetch(`${API_BASE}/api/loans/all-items`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const deviceData = await deviceRes.json();
        if (Array.isArray(deviceData)) {
          setDevices(deviceData);
        } else {
          setError(
            "error",
            t("error-by-loading"),
            t("unexpected-date-format_device"),
          );
        }
      } catch (e) {
        setError("error", t("error-by-loading"), t("error-fetching-loans"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="px-6 sm:px-8 pt-10">
      <Header />

      <Heading as="h2" size="md" mb={4}>
        {t("all-loans")}
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
          <Text color="colorPalette.600">{t("loading")}</Text>
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
                <strong>{t("username")}</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>{t("start-date")}</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>{t("end-date")}</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>{t("rented-items")}</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>{t("take-date")}</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>{t("return-date")}</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>{t("note")}</strong>
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
                <Table.Cell>{formatDateTime(loan.take_date)}</Table.Cell>
                <Table.Cell>{formatDateTime(loan.returned_date)}</Table.Cell>
                <Table.Cell>{loan.note}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {!isLoading && loans.length === 0 && !isError && (
        <Text color="gray.500" mt={2}>
          {t("no-loans-found")}
        </Text>
      )}

      <Heading as="h2" size="md" mb={4}>
        {t("all-devices")}
      </Heading>

      {/* Responsive Grid mit gleich hohen Karten */}
      <SimpleGrid minChildWidth="200px" gap={2} alignItems="stretch">
        {devices.map((device) => (
          <Card.Root
            key={device.id}
            size="sm"
            bg={device.in_safe ? "green" : "red"}
            h="full"
            minH="100px"
          >
            <Card.Header>
              <Heading size="md">
                <strong>{device.item_name}</strong>
              </Heading>
            </Card.Header>
            <Card.Body>
              <Text>
                <strong>{t("role")}</strong>: {device.can_borrow_role}
              </Text>
              <Text>
                <strong>{t("last-borrowed-person")}</strong>:{" "}
                {device.last_borrowed_person || "N/A"}
              </Text>
              <Text>
                <strong>{t("currently-borrowed-by")}</strong>:{" "}
                {device.currently_borrowing || "N/A"}
              </Text>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
      <HStack mt={3} gap={3} align="center" role="group" aria-label="Legende">
        <Text fontWeight="medium" color="fg.muted">
          {t("legend")}:
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
            <Text>{t("in-locker")}</Text>
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
            <Text>{t("not-in-locker")}</Text>
          </HStack>
        </Button>
      </HStack>
    </Container>
  );
};

export default Landingpage;
