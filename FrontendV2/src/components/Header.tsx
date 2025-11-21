import {
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
  Avatar,
  Card,
  Grid,
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
  Languages,
  Table,
} from "lucide-react";
import { useUserContext } from "@/states/Context";
import { useState } from "react";
import MyAlert from "./myChakra/MyAlert";
import { useTranslation } from "react-i18next";
import { API_BASE } from "@/config/api.config";

export const Header = () => {
  const navigate = useNavigate();
  const userData = useUserContext();
  console.log(userData);
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
  const [userDialog, setUserDialog] = useState(false);

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMsgTitle(t("err_pw_change"));
      setMsgDescription(t("pw_mismatch"));
      setMsgStatus("error");
      setIsMsg(true);
      return;
    }

    const response = await fetch(`${API_BASE}/api/users/change-password`, {
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

  const username = userData.first_name ? userData.first_name : "N/A";
  const fullname = userData.first_name + " " + userData.last_name;
  const randomColor = [
    "gray",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
  ];

  const logout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setTriggerLogout(true);
    navigate("/login", { replace: true });
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
                value="landingpage"
                onSelect={() => navigate("/landingpage", { replace: true })}
                children={
                  <HStack gap={3}>
                    <Table size={16} />
                    <Text as="span">{t("landingpage")}</Text>
                  </HStack>
                }
              />
              <Menu.Item
                value="change-language"
                onSelect={() => {
                  const currentLang = Cookies.get("language") || "en";
                  const newLang = currentLang === "en" ? "de" : "en";
                  Cookies.set("language", newLang);
                  window.location.reload();
                }}
                children={
                  <HStack gap={3}>
                    <Languages size={16} />
                    <Text as="span">{t("change-language")}</Text>
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
              {t("app-title")}
            </Heading>
          </Flex>

          <HStack gap={3} align="center" flexWrap="wrap">
            <Text fontSize="md" className="text-slate-600 dark:text-slate-400">
              {t("greeting")}
              <strong>{username}</strong>!
            </Text>
          </HStack>
        </Stack>

        {/* Avatar: visible on mobile, hidden on desktop (desktop version is in the actions bar) */}
        <HStack display={{ base: "flex", md: "none" }}>
          <Avatar.Root>
            <button
              onClick={() => setUserDialog(true)}
              style={{ cursor: "pointer" }}
            >
              <Avatar.Fallback name={fullname} />
            </button>
          </Avatar.Root>
        </HStack>

        {/* Right: Actions */}
        {/* Desktop actions */}
        <HStack
          gap={2}
          align="center"
          justify="flex-end"
          flexWrap="wrap"
          display={{ base: "none", md: "flex" }}
        >
          {/* Desktop avatar, aligned with action buttons */}
          <Avatar.Root
            colorPalette={randomColor[Math.floor(Math.random() * 10)]}
          >
            <button
              onClick={() => setUserDialog(true)}
              style={{ cursor: "pointer" }}
            >
              <Avatar.Fallback name={fullname} />
            </button>
          </Avatar.Root>

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

          <Button onClick={() => navigate("/landingpage", { replace: true })}>
            <HStack gap={2}>
              <Table size={18} />
              <Text as="span">{t("landingpage")}</Text>
            </HStack>
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              const currentLang = Cookies.get("language") || "en";
              const newLang = currentLang === "en" ? "de" : "en";
              Cookies.set("language", newLang);
              window.location.reload();
            }}
          >
            <HStack gap={2}>
              <Languages size={18} />
              <Text as="span">{t("change-language")}</Text>
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

      {/* User Info Dialoge */}
      {userDialog && (
        <Flex
          position="fixed"
          inset={0}
          zIndex={1000}
          align="center"
          justify="center"
          bg="blackAlpha.400"
          backdropFilter="blur(6px)"
        >
          <Card.Root maxW="sm" w="full" mx={4}>
            <Card.Header>
              <Card.Title>
                <Flex justify="center" align="center" w="100%">
                  <Avatar.Root
                    size={"2xl"}
                    colorPalette={randomColor[Math.floor(Math.random() * 10)]}
                  >
                    <Avatar.Fallback name={fullname} />
                  </Avatar.Root>
                </Flex>
              </Card.Title>
              <Card.Description>{t("user-info-desc")}</Card.Description>
            </Card.Header>
            <Card.Body>
              <Stack gap="4" w="full">
                <Box as="dl">
                  <Grid
                    templateColumns="auto 1fr"
                    rowGap={2}
                    columnGap={4}
                    alignItems="start"
                  >
                    <Text as="dt" fontWeight="bold" textAlign="left">
                      {t("first-name")}:
                    </Text>
                    <Text as="dd">{userData.first_name}</Text>

                    <Text as="dt" fontWeight="bold" textAlign="left">
                      {t("last-name")}:
                    </Text>
                    <Text as="dd">{userData.last_name}</Text>

                    <Text as="dt" fontWeight="bold" textAlign="left">
                      {t("username")}:
                    </Text>
                    <Text as="dd">{userData.username}</Text>

                    <Text as="dt" fontWeight="bold" textAlign="left">
                      {t("role")}:
                    </Text>
                    <Text as="dd">{userData.role}</Text>

                    <Text as="dt" fontWeight="bold" textAlign="left">
                      {t("admin-status")}:
                    </Text>
                    <Text as="dd">
                      {userData.is_admin ? t("yes") : t("no")}
                    </Text>
                  </Grid>
                </Box>

                <Button variant="solid" onClick={() => setPwOpen(true)}>
                  <HStack gap={2}>
                    <RotateCcwKey size={18} />
                    <Text as="span">{t("change-password")}</Text>
                  </HStack>
                </Button>
              </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
              <Button variant="outline" onClick={() => setUserDialog(false)}>
                {t("cancel")}
              </Button>
            </Card.Footer>
          </Card.Root>
        </Flex>
      )}

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
