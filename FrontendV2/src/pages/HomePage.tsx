import { useUserContext } from "@/states/Context";
import {
  Container,
  Stack,
  Heading,
  Text,
  Badge,
  Flex,
  Button,
  Input,
  Spinner,
  VStack,
  Table,
} from "@chakra-ui/react";
import { triggerLogoutAtom, setIsLoggedInAtom } from "@/states/Atoms";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { getBorrowableItems } from "@/utils/Fetcher";
import { useState } from "react";
import MyAlert from "@/components/myChakra/MyAlert";
import { borrowAbleItemsAtom } from "@/states/Atoms";
import { createLoan } from "@/utils/Fetcher";

export interface User {
  username: string;
  role: number;
}

export const HomePage = () => {
  const userData = useUserContext();
  const [, setTriggerLogout] = useAtom(triggerLogoutAtom);
  const [, setIsLoggedIn] = useAtom(setIsLoggedInAtom);
  const [borrowableItems, setBorrowableItems] = useAtom(borrowAbleItemsAtom);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Error handling states
  const [isMsg, setIsMsg] = useState(false);
  const [msgStatus, setMsgStatus] = useState<"error" | "success">("error");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgDescription, setMsgDescription] = useState("");

  const handleCheckboxChange = (itemId: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  return (
    <Container maxW="7xl" className="px-6 sm:px-8 pt-10">
      <Stack as="header" gap={3} className="mb-16">
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
          gap={4}
        >
          <Stack gap={2}>
            <Heading
              size="2xl"
              className="tracking-tight text-slate-900 dark:text-slate-100"
            >
              Home
            </Heading>
            <Stack
              direction={{ base: "column", sm: "row" }}
              gap={2}
              alignItems="start"
            >
              <Text
                fontSize="md"
                className="text-slate-600 dark:text-slate-400"
              >
                Willkommen zurück,{" "}
                {userData.username.replace(
                  /^./,
                  userData.username[0].toUpperCase()
                )}
                !
              </Text>
              <Badge variant="subtle" px={2} py={1} borderRadius="full">
                Rolle: {userData.role}
              </Badge>
            </Stack>
          </Stack>

          <Button
            onClick={() => {
              Cookies.remove("token");
              setIsLoggedIn(false);
              setTriggerLogout(true);
            }}
            variant="solid"
            size="sm"
            className="self-start md:self-auto"
          >
            Logout
          </Button>
        </Flex>
      </Stack>
      {isMsg && (
        <MyAlert
          status={msgStatus}
          title={msgTitle}
          description={msgDescription}
        />
      )}
      <Stack as="main">
        <label htmlFor="startDate">
          <Text>Startdatum</Text>
        </label>
        <Input
          id="startDate"
          placeholder="Startdatum"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate">
          <Text>Enddatum</Text>
        </label>
        <Input
          id="endDate"
          placeholder="Enddatum"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          onClick={async () => {
            setIsLoadingA(true);
            if (!startDate || !endDate) {
              setMsgStatus("error");
              setMsgTitle("Fehlende Eingaben");
              setMsgDescription("Bitte Start- und Enddatum angeben.");
              setIsMsg(true);
              setIsLoadingA(false);
              return;
            }
            await getBorrowableItems(startDate, endDate).then((response) => {
              setIsLoadingA(false);
              if (response && response.status === "error") {
                setMsgStatus("error");
                setMsgTitle(response.title || "Fehler");
                setMsgDescription(
                  response.description || "Unbekannter Frontend Fehler"
                );
                setIsMsg(true);
                return;
              }
              setBorrowableItems(response.data);
              setIsMsg(false);
              console.log(borrowableItems);
            });
          }}
        >
          Verfügbare Gegenstände anzeigen
        </Button>
        {isLoadingA && (
          <VStack colorPalette="teal">
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Loading...</Text>
          </VStack>
        )}
        {borrowableItems.length > 0 && (
          <Table.ScrollArea borderWidth="1px" rounded="md" height="160px">
            <Table.Root size="sm" stickyHeader>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader></Table.ColumnHeader>
                  <Table.ColumnHeader>Gegenstand</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {borrowableItems.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <input
                        onChange={() => handleCheckboxChange(item.id)}
                        type="checkbox"
                        name={item.id}
                        id={item.id}
                      />
                    </Table.Cell>
                    <Table.Cell>{item.item_name}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
        {selectedItems.length >= 1 && (
          <Button
            onClick={() =>
              createLoan(selectedItems, startDate, endDate).then((response) => {
                if (response.status === "error") {
                  setMsgStatus("error");
                  setMsgTitle(response.title || "Fehler");
                  setMsgDescription(
                    response.description || "Unbekannter Frontend Fehler"
                  );
                  setIsMsg(true);
                  return;
                }
                setMsgStatus("success");
                setMsgTitle("Erfolg");
                setMsgDescription("Gegenstände erfolgreich ausgeliehen.");
                setIsMsg(true);
              })
            }
          >
            Gegenstände ausleihen
          </Button>
        )}
      </Stack>
    </Container>
  );
};
