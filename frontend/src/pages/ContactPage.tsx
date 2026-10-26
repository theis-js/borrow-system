import {
  Field,
  Textarea,
  Button,
  Alert,
  Container,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { API_BASE } from "@/config/api.config";
import Cookies from "js-cookie";
import { Header } from "@/components/Header";

interface Alert {
  type: "info" | "warning" | "success" | "error" | "neutral";
  headline: string;
  text: string;
}

export const ContactPage = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);

  const sendMessage = async () => {
    setIsSending(true);
    if (message.trim() === "") {
      setAlert({
        type: "error",
        headline: t("contactPage_messageErrorHeadline"),
        text: t("contactPage_messageErrorText2"),
      });
      setIsSending(false);
      return;
    }

    // Logic to send the message
    const result = await fetch(`${API_BASE}/api/users/contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token") || ""}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (result.ok) {
      setAlert({
        type: "success",
        headline: t("contactPage_successHeadline"),
        text: t("contactPage_successText"),
      });
      setMessage("");
    } else if (result.status === 503) {
      setAlert({
        type: "error",
        headline: t("serviceDeactivatedHeadline"),
        text: t("contactPage_serviceDeactivatedText"),
      });
    } else {
      setAlert({
        type: "error",
        headline: t("contactPage_errorHeadline"),
        text: t("contactPage_errorText"),
      });
    }
    setIsSending(false);
  };

  return (
    <Container className="px-6 sm:px-8 pt-10">
      <Header />
      <Field.Root invalid={message === ""}>
        <Field.Label>
          <Text>{t("contactPage_messageDescription")}</Text>
          <Field.RequiredIndicator />
        </Field.Label>
        <Textarea
          placeholder={t("contactPage_messagePlaceholder")}
          variant="subtle"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {message === "" && (
          <Field.ErrorText>{t("contactPage_messageErrorText")}</Field.ErrorText>
        )}
      </Field.Root>
      {alert && (
        <Alert.Root status={alert.type}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{alert.headline}</Alert.Title>
            <Alert.Description>{alert.text}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
      {isSending && (
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">{t("loading")}</Text>
        </VStack>
      )}
      <Button onClick={sendMessage}>{t("contactPage_sendButton")}</Button>
    </Container>
  );
};
