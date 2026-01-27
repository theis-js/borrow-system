import {
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  HStack,
  IconButton,
  Menu,
  Box,
  Avatar,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { setIsLoggedInAtom, triggerLogoutAtom } from "@/states/Atoms";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  LifeBuoy,
  LogOut,
  CalendarPlus,
  MoreVertical,
  Languages,
  Table,
  ContactRound,
} from "lucide-react";
import { useUserContext } from "@/states/Context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserDialogue } from "./UserDialogue";

export const Header = () => {
  const navigate = useNavigate();
  const userData = useUserContext();
  const { t } = useTranslation();

  const [, setTriggerLogout] = useAtom(triggerLogoutAtom);
  const [, setIsLoggedIn] = useAtom(setIsLoggedInAtom);

  const [userDialog, setUserDialog] = useState(false);

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
                    "noopener,noreferrer",
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
                value="contact"
                onSelect={() => navigate("/contact", { replace: true })}
                children={
                  <HStack gap={3}>
                    <ContactRound size={16} />
                    <Text as="span">{t("contact")}</Text>
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

          <Button
            variant={"outline"}
            onClick={() => navigate("/contact", { replace: true })}
          >
            <HStack gap={2}>
              <ContactRound size={18} />
              <Text as="span">{t("contact")}</Text>
            </HStack>
          </Button>

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
        <UserDialogue
          setUserDialog={setUserDialog}
          fullname={fullname}
          randomColor={randomColor}
        />
      )}
    </Stack>
  );
};
