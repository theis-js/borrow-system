import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import MyAlert from "@/components/myChakra/MyAlert";
import {
  Container,
  VStack,
  Spinner,
  Text,
  Table,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Code,
} from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { Trash2 } from "lucide-react";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const MyLoansPage = () => {
  const navigate = useNavigate();

  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [delLoanCode, setDelLoanCode] = useState<number | null>(null);

  // Error handling states
  const [isMsg, setIsMsg] = useState(false);
  const [msgStatus, setMsgStatus] = useState<"error" | "success">("error");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgDescription, setMsgDescription] = useState("");

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchLoans = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/api/userLoans`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (!res.ok) {
          setMsgStatus("error");
          setMsgTitle("Fehler");
          setMsgDescription(
            "Beim Laden der Ausleihen ist ein Fehler aufgetreten."
          );
          setIsMsg(true);
          return;
        }

        const data = await res.json();
        setLoans(data);
        console.log("Fetched loans:", data);
      } catch (e) {
        setMsgStatus("error");
        setMsgTitle("Fehler");
        setMsgDescription("Netzwerkfehler beim Laden der Ausleihen.");
        setIsMsg(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [navigate]);

  const deleteLoan = async (loanId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/SETdeleteLoan/${loanId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (!res.ok) {
        setMsgStatus("error");
        setMsgTitle("Fehler");
        setMsgDescription(
          "Beim Löschen der Ausleihe ist ein Fehler aufgetreten."
        );
        setIsMsg(true);
        return;
      }

      setLoans((prev) => prev.filter((loan) => loan.id !== loanId));
      setMsgStatus("success");
      setMsgTitle("Erfolg");
      setMsgDescription("Ausleihe erfolgreich gelöscht.");
      setIsMsg(true);
    } catch (e) {
      setMsgStatus("error");
      setMsgTitle("Fehler");
      setMsgDescription("Netzwerkfehler beim Löschen der Ausleihe.");
      setIsMsg(true);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m) return iso;
    const [, y, M, d, h, min] = m;
    return `${d}.${M}.${y} ${h}:${min}`;
  };

  return (
    <>
      <Container maxW="7xl" className="px-6 sm:px-8 pt-10">
        <Header />
        {isMsg && (
          <MyAlert
            status={msgStatus}
            title={msgTitle}
            description={msgDescription}
          />
        )}
        {isLoading && (
          <VStack colorPalette="teal">
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Loading...</Text>
          </VStack>
        )}
        {loans && (
          <Table.Root
            size="sm"
            variant="outline"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <Table.ColumnGroup>
              {/* Ausleihcode */}
              <Table.Column style={{ width: "14%" }} />
              {/* Startdatum */}
              <Table.Column style={{ width: "14%" }} />
              {/* Enddatum */}
              <Table.Column style={{ width: "14%" }} />
              {/* Geräte (flexibler) */}
              <Table.Column style={{ width: "28%" }} />
              {/* Ausleihdatum */}
              <Table.Column style={{ width: "14%" }} />
              {/* Rückgabedatum */}
              <Table.Column style={{ width: "14%" }} />
              {/* Aktionen */}
              <Table.Column style={{ width: "8%" }} />
            </Table.ColumnGroup>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Ausleihcode</Table.ColumnHeader>
                <Table.ColumnHeader>Startdatum</Table.ColumnHeader>
                <Table.ColumnHeader>Enddatum</Table.ColumnHeader>
                <Table.ColumnHeader>Geräte</Table.ColumnHeader>
                <Table.ColumnHeader>Ausleihdatum</Table.ColumnHeader>
                <Table.ColumnHeader>Rückgabedatum</Table.ColumnHeader>
                <Table.ColumnHeader>Aktionen</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loans.map((loan) => (
                <Table.Row key={loan.id}>
                  <Table.Cell>
                    <Text title={loan.loan_code}>
                      <Code variant="solid">{`${loan.loan_code}`}</Code>
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{formatDate(loan.start_date)}</Table.Cell>
                  <Table.Cell>{formatDate(loan.end_date)}</Table.Cell>
                  <Table.Cell>
                    <Text title={loan.loaned_items_name}>
                      {loan.loaned_items_name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{formatDate(loan.take_date)}</Table.Cell>
                  <Table.Cell>{formatDate(loan.returned_date)}</Table.Cell>
                  <Table.Cell>
                    <Dialog.Root role="alertdialog">
                      <Dialog.Trigger asChild>
                        <Button
                          onClick={() => setDelLoanCode(loan.loan_code)}
                          aria-label="Ausleihe löschen"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </Dialog.Trigger>
                      <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                          <Dialog.Content>
                            <Dialog.Header>
                              <Dialog.Title>Sicher?</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                              <Text>
                                Möchtest du die Ausleihe mit dem{" "}
                                <strong><Code>{delLoanCode}</Code></strong> Code wirklich
                                löschen?
                                <br />
                                Für den Admin bleibt sie weiterhin sichtbar.
                              </Text>
                            </Dialog.Body>
                            <Dialog.Footer>
                              <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Abbrechen</Button>
                              </Dialog.ActionTrigger>
                              <Button
                                colorPalette="red"
                                onClick={() => deleteLoan(loan.id)}
                              >
                                <strong>Löschen</strong>
                              </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                              <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                          </Dialog.Content>
                        </Dialog.Positioner>
                      </Portal>
                    </Dialog.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Container>
    </>
  );
};
