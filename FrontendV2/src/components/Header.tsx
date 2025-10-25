import {
  Badge,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  CloseButton,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { setIsLoggedInAtom, triggerLogoutAtom } from "@/states/Atoms";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  RotateCcwKey,
  Code,
  LifeBuoy,
  LogOut,
  CalendarPlus,
} from "lucide-react";
import { useUserContext } from "@/states/Context";
import { useState } from "react";
import MyAlert from "./myChakra/MyAlert";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const Header = () => {
  const navigate = useNavigate();

  const userData = useUserContext();

  // Error handling states
  const [isMsg, setIsMsg] = useState(false);
  const [msgStatus, setMsgStatus] = useState<"error" | "success">("error");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgDescription, setMsgDescription] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [, setTriggerLogout] = useAtom(triggerLogoutAtom);
  const [, setIsLoggedIn] = useAtom(setIsLoggedInAtom);

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMsgTitle("Passwortänderung fehlgeschlagen");
      setMsgDescription("Passwörter stimmen nicht überein");
      setMsgStatus("error");
      setIsMsg(true);
      return;
    }

    const response = await fetch(`${API_BASE}/api/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      setMsgTitle("Passwortänderung fehlgeschlagen");
      setMsgDescription("Bitte überprüfen Sie Ihre Eingaben");
      setMsgStatus("error");
      setIsMsg(true);
      return;
    }

    setMsgTitle("Passwort erfolgreich geändert");
    setMsgDescription("Ihr Passwort wurde erfolgreich geändert");
    setMsgStatus("success");
    setIsMsg(true);
  };

  return (
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
            <Text fontSize="md" className="text-slate-600 dark:text-slate-400">
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

        <Button onClick={() => navigate("/", { replace: true })}>
          <CalendarPlus /> Ausleihe erstellen
        </Button>
        <Button onClick={() => navigate("/my-loans", { replace: true })}>
          <CircleUserRound /> Meine Ausleihen
        </Button>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button>
              <RotateCcwKey /> Passwort ändern
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Passwort ändern</Dialog.Title>
                </Dialog.Header>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    changePassword();
                  }}
                >
                  <Dialog.Body>
                    <PasswordInput
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Altes Passwort"
                    />
                    <PasswordInput
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Neues Passwort"
                    />
                    <PasswordInput
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Neues Passwort wiederholen"
                    />
                  </Dialog.Body>
                  <Dialog.Footer>
                    {isMsg && (
                      <MyAlert
                        status={msgStatus}
                        title={msgTitle}
                        description={msgDescription}
                      />
                    )}
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button type="submit">Save</Button>
                  </Dialog.Footer>
                </form>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
        <a
          href="https://git.the1s.de/Matthias-Claudius-Schule/borrow-system/wiki"
          target="_blank"
        >
          <Button>
            <LifeBuoy /> Hilfe
          </Button>
        </a>

        <a
          href="https://git.the1s.de/Matthias-Claudius-Schule/borrow-system"
          target="_blank"
        >
          <Button>
            <Code /> Source Code
          </Button>
        </a>
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
          <LogOut /> Logout
        </Button>
      </Flex>
    </Stack>
  );
};
