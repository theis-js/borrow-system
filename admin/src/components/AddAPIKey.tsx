import React from "react";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { createAPIentry } from "@/utils/userActions";

type AddAPIKeyProps = {
  onClose: () => void;
  alert: (
    status: "success" | "error",
    message: string,
    description: string
  ) => void;
};

const AddAPIKey: React.FC<AddAPIKeyProps> = ({ onClose, alert }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Title>Neuen API Key erstellen</Card.Title>
          <Card.Description>
            Füllen Sie das folgende Formular aus, um einen API Key zu erstellen.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root>
              <Field.Label>API key</Field.Label>
              <Input type="number" id="apiKey" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Benutzer</Field.Label>
              <Input id="user" type="text" />
            </Field.Root>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            variant="solid"
            onClick={async () => {
              const apiKey =
                (
                  document.getElementById("apiKey") as HTMLInputElement
                )?.value.trim() || "";
              const user =
                (
                  document.getElementById("user") as HTMLInputElement
                )?.value.trim() || "";

              if (!apiKey || !user) return;

              const res = await createAPIentry(apiKey, user);
              if (res.success) {
                alert(
                  "success",
                  "API Key erstellt",
                  "Der API Key wurde erfolgreich erstellt."
                );
                onClose();
              } else {
                alert(
                  "error",
                  "Fehler beim Erstellen des API Keys",
                  res.message ||
                    "Beim Erstellen des API Keys ist ein Fehler aufgetreten. (frontend bug)"
                );
                onClose();
              }
            }}
          >
            Erstellen
          </Button>
        </Card.Footer>
      </Card.Root>
    </div>
  );
};

export default AddAPIKey;
