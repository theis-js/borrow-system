import {
  Container,
  Stack,
  Text,
  Button,
  Input,
  Spinner,
  VStack,
  Table,
  InputGroup,
  Span,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { getBorrowableItems } from "@/utils/Fetcher";
import { useState } from "react";
import MyAlert from "@/components/myChakra/MyAlert";
import { borrowAbleItemsAtom } from "@/states/Atoms";
import { createLoan } from "@/utils/Fetcher";
import { Header } from "@/components/Header";
import { useTranslation } from "react-i18next";

export interface User {
  username: string;
  role: number;
}

export const HomePage = () => {
  const { t } = useTranslation();

  const [borrowableItems, setBorrowableItems] = useAtom(borrowAbleItemsAtom);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const MAX_CHARACTERS = 500;
  const [note, setNote] = useState("");

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
    <Container className="px-6 sm:px-8 pt-10">
      <Header />
      {isMsg && (
        <MyAlert
          status={msgStatus}
          title={msgTitle}
          description={msgDescription}
        />
      )}
      <Stack as="main">
        <Text>{t("timezone-info")}</Text>
        <label htmlFor="startDate">
          <strong>
            <Text>{t("start-date")}</Text>
          </strong>
        </label>
        <Input
          id="startDate"
          placeholder={t("start-date")}
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate">
          <strong>
            <Text>{t("end-date")}</Text>
          </strong>
        </label>
        <Input
          id="endDate"
          placeholder={t("end-date")}
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          onClick={async () => {
            setIsLoadingA(true);
            if (!startDate || !endDate) {
              setMsgStatus("error");
              setMsgTitle(t("missing-fields"));
              setMsgDescription(t("missing-fields-desc"));
              setIsMsg(true);
              setIsLoadingA(false);
              return;
            }
            await getBorrowableItems(startDate, endDate).then((response) => {
              setIsLoadingA(false);
              if (response && response.status === "error") {
                setMsgStatus("error");
                setMsgTitle(response.title || t("error"));
                setMsgDescription(response.description || t("unknown-error"));
                setIsMsg(true);
                return;
              }
              setBorrowableItems(response.data);
              setIsMsg(false);
              console.log(borrowableItems);
            });
          }}
        >
          {t("get-borrowable-items")}
        </Button>
        {isLoadingA && (
          <VStack colorPalette="teal">
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">{t("loading")}</Text>
          </VStack>
        )}
        {borrowableItems.length > 0 && (
          <Table.ScrollArea borderWidth="1px" rounded="md">
            <Table.Root size="sm" stickyHeader>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader></Table.ColumnHeader>
                  <Table.ColumnHeader>{t("item")}</Table.ColumnHeader>
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
                <Table.Row>
                  <Table.Cell colSpan={2}>
                    <InputGroup
                      endElement={
                        <Span color="fg.muted" textStyle="xs">
                          {note.length} / {MAX_CHARACTERS}
                        </Span>
                      }
                    >
                      <Input
                        placeholder={t("optional-note")}
                        value={note}
                        maxLength={MAX_CHARACTERS}
                        onChange={(e) => {
                          setNote(
                            e.currentTarget.value.slice(0, MAX_CHARACTERS)
                          );
                        }}
                      />
                    </InputGroup>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
        {selectedItems.length >= 1 && (
          <Button
            onClick={() =>
              createLoan(selectedItems, startDate, endDate, note).then(
                (response) => {
                  if (response.status === "error") {
                    setMsgStatus("error");
                    setMsgTitle(response.title || t("error"));
                    setMsgDescription(
                      response.description || t("unknown-error")
                    );
                    setIsMsg(true);
                    return;
                  }
                  setMsgStatus("success");
                  setMsgTitle(t("success"));
                  setMsgDescription(t("loan-success"));
                  setIsMsg(true);
                }
              )
            }
          >
            {t("create-loan")}
          </Button>
        )}
      </Stack>
    </Container>
  );
};
