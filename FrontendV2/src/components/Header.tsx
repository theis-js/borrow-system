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
  HStack,
  IconButton,
  Menu,
  Box,
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
  MoreVertical,
} from "lucide-react";
import { useUserContext } from "@/states/Context";
import { useState } from "react";
import MyAlert from "./myChakra/MyAlert";
import { useTranslation } from "react-i18next";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const Header = () => {
  const navigate = useNavigate();
  const userData = useUserContext();
  const { t } = useTranslation();

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

  // Dialog control
  const [isPwOpen, setPwOpen] = useState(false);

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMsgTitle(t("err_pw_change"));
      setMsgDescription(t("pw_mismatch"));
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
      setMsgTitle(t("err_pw_change"));
      setMsgDescription(t("pw_mismatch"));
      setMsgStatus("error");
      setIsMsg(true);
      return;
    }

    setMsgTitle(t("pw_success"));
    setMsgDescription(t("pw_success_desc"));
    setMsgStatus("success");
    setIsMsg(true);

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const username = userData?.username
    ? userData.username[0].toUpperCase() + userData.username.slice(1)
    : "User";

  const logout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setTriggerLogout(true);
  };

  return (
    <Stack
      as="header"
      gap={3}
      className="mb-6"
      position="relative"
      pr={{ base: 10, md: 0 }} // Platz für den Mobile-Button rechts
    >
      {/* Mobile: Drei-Punkte-Button, vertikal zentriert im Header */}
      <Box
        display={{ base: "block", md: "none" }}
        position="absolute"
        top="50%"
        right="0"
        transform="translateY(-50%)"
        zIndex={2}
      >
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton
              aria-label="Aktionen"
              variant="solid"
              colorScheme="teal"
              size="md"
              borderRadius="full"
              boxShadow="md"
            >
              <MoreVertical size={20} />
            </IconButton>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value="create-loan"
                onSelect={() => navigate("/", { replace: true })}
                children={
                  <HStack gap={3}>
                    <CalendarPlus size={16} />
                    <Text as="span">{t("create-loan")}</Text>
                  </HStack>
                }
              />
              <Menu.Item
                value="my-loans"
                onSelect={() => navigate("/my-loans", { replace: true })}
                children={
                  <HStack gap={3}>
                    <CircleUserRound size={16} />
                    <Text as="span">{t("my-loans")}</Text>
                  </HStack>
                }
              />
              <Menu.Item
                value="change-password"
                onSelect={() => setPwOpen(true)}
                children={
                  <HStack gap={3}>
                    <RotateCcwKey size={16} />
                    <Text as="span">{t("change-password")}</Text>
                  </HStack>
                }
              />
              <Menu.Item
                value="help"
                onSelect={() =>
                  window.open(
                    "https://git.the1s.de/Matthias-Claudius-Schule/borrow-system/wiki",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                children={
                  <HStack gap={3}>
                    <LifeBuoy size={16} />
                    <Text as="span">{t("help")}</Text>
                  </HStack>
                }
              />
              <Menu.Item
                value="source-code"
                onSelect={() =>
                  window.open(
                    "https://git.the1s.de/Matthias-Claudius-Schule/borrow-system",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                children={
                  <HStack gap={3}>
                    <Code size={16} />
                    <Text as="span">{t("source-code")}</Text>
                  </HStack>
                }
              />
              <Menu.Separator />
              <Menu.Item
                value="logout"
                onSelect={logout}
                children={
                  <HStack gap={3} color="red.500">
                    <LogOut size={16} />
                    <Text as="span">{t("logout")}</Text>
                  </HStack>
                }
              />
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Box>

      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        gap={4}
      >
        {/* Left: Title + user info */}
        <Stack gap={1}>
          {/* Titelzeile ohne Mobile-Menu (wurde nach oben verlegt) */}
          <Flex align="center" justify="space-between" gap={2}>
            <Heading
              size="2xl"
              className="tracking-tight text-slate-900 dark:text-slate-100"
            >
              Home
            </Heading>
          </Flex>

          <HStack gap={3} align="center" flexWrap="wrap">
            <Text fontSize="md" className="text-slate-600 dark:text-slate-400">
              {t("greeting")}
              <strong>{username}</strong>!
            </Text>
            <Badge variant="subtle" px={2} py={1} borderRadius="full">
              Rolle: {userData?.role ?? "—"}
            </Badge>
          </HStack>
        </Stack>

        {/* Right: Actions */}
        {/* Desktop actions */}
        <HStack
          gap={2}
          align="center"
          justify="flex-end"
          flexWrap="wrap"
          display={{ base: "none", md: "flex" }}
        >
          <Button
            colorScheme="teal"
            onClick={() => navigate("/", { replace: true })}
          >
            <HStack gap={2}>
              <CalendarPlus size={18} />
              <Text as="span">{t("create-loan")}</Text>
            </HStack>
          </Button>

          <Button onClick={() => navigate("/my-loans", { replace: true })}>
            <HStack gap={2}>
              <CircleUserRound size={18} />
              <Text as="span">{t("my-loans")}</Text>
            </HStack>
          </Button>

          <Button variant="ghost" onClick={() => setPwOpen(true)}>
            <HStack gap={2}>
              <RotateCcwKey size={18} />
              <Text as="span">{t("change-password")}</Text>
            </HStack>
          </Button>

          <a
            href="https://git.the1s.de/Matthias-Claudius-Schule/borrow-system/wiki"
            target="_blank"
          >
            <Button variant="ghost">
              <HStack gap={2}>
                <LifeBuoy size={18} />
                <Text as="span">{t("help")}</Text>
              </HStack>
            </Button>
          </a>

          <a
            href="https://git.the1s.de/Matthias-Claudius-Schule/borrow-system"
            target="_blank"
          >
            <Button variant="ghost">
              <HStack gap={2}>
                <Code size={18} />
                <Text as="span">{t("source-code")}</Text>
              </HStack>
            </Button>
          </a>

          <Button onClick={logout} variant="outline" colorScheme="red">
            <HStack gap={2}>
              <LogOut size={18} />
              <Text as="span">{t("logout")}</Text>
            </HStack>
          </Button>
        </HStack>
      </Flex>

      {/* Passwort-Dialog (kontrolliert) */}
      <Dialog.Root open={isPwOpen} onOpenChange={(e: any) => setPwOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="md">
              <Dialog.Header>
                <Dialog.Title>{t("change-password")}</Dialog.Title>
              </Dialog.Header>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  changePassword();
                }}
              >
                <Dialog.Body>
                  <Stack gap={3}>
                    <PasswordInput
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder={t("old-password")}
                    />
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t("new-password")}
                    />
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("confirm-password")}
                    />
                  </Stack>
                </Dialog.Body>
                <Dialog.Footer>
                  <Stack w="100%" gap={3}>
                    {isMsg && (
                      <MyAlert
                        status={msgStatus}
                        title={msgTitle}
                        description={msgDescription}
                      />
                    )}
                    <HStack justify="flex-end" gap={2}>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline">{t("cancel")}</Button>
                      </Dialog.ActionTrigger>
                      <Button type="submit" colorScheme="teal">
                        {t("save")}
                      </Button>
                    </HStack>
                  </Stack>
                </Dialog.Footer>
              </form>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>
  );
};
