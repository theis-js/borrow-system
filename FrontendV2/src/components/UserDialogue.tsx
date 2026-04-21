import {
  Button,
  Flex,
  Stack,
  Text,
  CloseButton,
  Dialog,
  Portal,
  HStack,
  Box,
  Avatar,
  Card,
  Grid,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { RotateCcwKey } from "lucide-react";
import MyAlert from "./myChakra/MyAlert";
import { API_BASE } from "@/config/api.config";
import { useUserContext } from "@/states/Context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

type UserDialogueProps = {
  setUserDialog: (value: boolean) => void;
  fullname: string;
  randomColor: string[];
};

export const UserDialogue = (props: UserDialogueProps) => {
  const userData = useUserContext();
  const { t } = useTranslation();
  // Error handling states
  const [isMsg, setIsMsg] = useState(false);
  const [msgStatus, setMsgStatus] = useState<"error" | "success">("error");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgDescription, setMsgDescription] = useState("");

  const [isMsgNAAS, setIsMsgNAAS] = useState(false);
  const [msgStatusNAAS, setMsgStatusNAAS] = useState<"error" | "success">(
    "error",
  );
  const [msgTitleNAAS, setMsgTitleNAAS] = useState("");
  const [msgDescriptionNAAS, setMsgDescriptionNAAS] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Dialog control
  const [isPwOpen, setPwOpen] = useState(false);
  const [naasDialog, setNaasDialog] = useState(false);
  const [naas, setNaas] = useState("");

  const openNAAS = async () => {
    try {
      const response = await fetch(`${API_BASE}/no`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await response.json();
      setNaas(data.reason);
      setNaasDialog(true);
    } catch (error) {
      setMsgStatusNAAS("error");
      setMsgTitleNAAS(t("naas-error"));
      setMsgDescriptionNAAS(t("naas-error-desc"));
      setIsMsgNAAS(true);

      console.log(msgStatusNAAS, msgTitleNAAS, msgDescriptionNAAS);
    }
  };

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

  return (
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
                colorPalette={props.randomColor[Math.floor(Math.random() * 10)]}
              >
                <Avatar.Fallback name={props.fullname} />
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
                <Text as="dd">{userData.is_admin ? t("yes") : t("no")}</Text>
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
        <Card.Footer>
          <Stack w="100%" gap={3}>
            {isMsgNAAS && (
              <MyAlert
                status={msgStatusNAAS}
                title={msgTitleNAAS}
                description={msgDescriptionNAAS}
              />
            )}
            <HStack justify="flex-end" gap={2} wrap="wrap">
              <Button
                variant="outline"
                onClick={() => props.setUserDialog(false)}
              >
                {t("cancel")}
              </Button>
              <Button variant="outline" onClick={() => openNAAS()}>
                {t("try-naas")}
              </Button>
            </HStack>
          </Stack>
        </Card.Footer>
      </Card.Root>

      {/* Passwort-Dialog */}
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

      <HStack wrap="wrap" gap="4">
        <Dialog.Root
          placement={"center"}
          open={naasDialog}
          motionPreset="slide-in-bottom"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>{t("naas-header")}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>{naas}</p>
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton onClick={() => setNaasDialog(false)} size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </HStack>
    </Flex>
  );
};
