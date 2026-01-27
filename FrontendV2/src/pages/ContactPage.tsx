import { Field, Textarea, Button, Alert, Container } from "@chakra-ui/react";
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
  const [alert, setAlert] = useState<Alert | null>(null);

  const sendMessage = async () => {
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
    } else {
      setAlert({
        type: "error",
        headline: t("contactPage_errorHeadline"),
        text: t("contactPage_errorText"),
      });
    }
  };

  return (
    <Container className="px-6 sm:px-8 pt-10">
      <Header />
      <Field.Root invalid={message === ""}>
        <Field.Label>
          {t("contactPage_messageLabel")}
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
      <Button onClick={sendMessage}>{t("contactPage_sendButton")}</Button>
    </Container>
  );
};
