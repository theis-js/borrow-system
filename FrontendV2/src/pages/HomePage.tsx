import { useUserContext } from "@/states/Context";
import {
  Container,
  Stack,
  Heading,
  Text,
  Badge,
  Flex,
  Button,
} from "@chakra-ui/react";
import { triggerLogoutAtom, setIsLoggedInAtom } from "@/states/Atoms";
import { useAtom } from "jotai";
import Cookies from "js-cookie";

export interface User {
  username: string;
  role: number;
}

export const HomePage = () => {
  const userData = useUserContext();
  const [, setTriggerLogout] = useAtom(triggerLogoutAtom);
  const [, setIsLoggedIn] = useAtom(setIsLoggedInAtom);

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
                Willkommen zurück, {userData.username}!
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
    </Container>
  );
};
