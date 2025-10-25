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

  // Error handling states
  const [isError, setIsError] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

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
      {isError && (
        <MyAlert
          status="error"
          title={errorTitle}
          description={errorDescription}
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
              setErrorTitle("Fehlende Eingaben");
              setErrorDescription("Bitte Start- und Enddatum angeben.");
              setIsError(true);
              setIsLoadingA(false);
              return;
            }
            await getBorrowableItems(startDate, endDate).then((response) => {
              setIsLoadingA(false);
              if (response && response.status === "error") {
                setErrorTitle(response.title || "Fehler");
                setErrorDescription(
                  response.description || "Unbekannter Frontend Fehler"
                );
                setIsError(true);
                return;
              }
              setBorrowableItems(response.data);
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
                      <input type="checkbox" name={item.id} id={item.id} />
                    </Table.Cell>
                    <Table.Cell>{item.item_name}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
      </Stack>
    </Container>
  );
};
