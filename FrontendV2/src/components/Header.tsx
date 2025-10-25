import { Badge, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
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

export const Header = () => {
  const navigate = useNavigate();

  const userData = useUserContext();

  const [, setTriggerLogout] = useAtom(triggerLogoutAtom);
  const [, setIsLoggedIn] = useAtom(setIsLoggedInAtom);

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
        <Button>
          <RotateCcwKey /> Passwort ändern
        </Button>
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
