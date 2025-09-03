import React from "react";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { changePW } from "@/utils/userActions";

type ChangePWformProps = {
  onClose: () => void;
  alert: (
    status: "success" | "error",
    message: string,
    description: string
  ) => void;
  username: string;
};

const ChangePWform: React.FC<ChangePWformProps> = ({
  onClose,
  alert,
  username,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Title>Passwort ändern</Card.Title>
          <Card.Description>
            Füllen Sie das folgende Formular aus, um das Passwort zu ändern.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root>
              <Field.Label>Neues Passwort</Field.Label>
              <Input
                id="new_password"
                type="password"
                placeholder="Neues Passwort"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Neues Passwort widerholen</Field.Label>
              <Input
                id="confirm_new_password"
                type="password"
                placeholder="Wiederholen Sie das neue Passwort"
              />
            </Field.Root>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end" gap="2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            variant="solid"
            onClick={async () => {
              const newPassword =
                (
                  document.getElementById("new_password") as HTMLInputElement
                )?.value.trim() || "";
              const confirmNewPassword =
                (
                  document.getElementById(
                    "confirm_new_password"
                  ) as HTMLInputElement
                )?.value.trim() || "";

              if (!newPassword || newPassword !== confirmNewPassword) return;

              const res = await changePW(newPassword, username);
              if (res.success) {
                alert(
                  "success",
                  "Passwort geändert",
                  "Das Passwort wurde erfolgreich geändert."
                );
                onClose();
              } else {
                alert(
                  "error",
                  "Fehler",
                  "Das Passwort konnte nicht geändert werden."
                );
                onClose();
              }
            }}
          >
            Ändern
          </Button>
        </Card.Footer>
      </Card.Root>
    </div>
  );
};

export default ChangePWform;
