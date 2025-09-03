import React from "react";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { createUser } from "@/utils/userActions";

type AddFormProps = {
  onClose: () => void;
  alert: (
    status: "success" | "error",
    message: string,
    description: string
  ) => void;
};

const AddForm: React.FC<AddFormProps> = ({ onClose, alert }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Title>Neuen Nutzer erstellen</Card.Title>
          <Card.Description>
            Füllen Sie das folgende Formular aus, um einen Nutzer zu erstellen.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input id="username" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input id="password" type="password" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Role</Field.Label>
              <Input id="role" type="number" />
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
              const username =
                (
                  document.getElementById("username") as HTMLInputElement
                )?.value.trim() || "";
              const password =
                (document.getElementById("password") as HTMLInputElement)
                  ?.value || "";
              const role = Number(
                (document.getElementById("role") as HTMLInputElement)?.value
              );

              if (!username || !password || Number.isNaN(role)) return;

              const res = await createUser(username, role, password);
              if (res.success) {
                alert(
                  "success",
                  "Nutzer erstellt",
                  "Der Nutzer wurde erfolgreich erstellt."
                );
                onClose();
              } else {
                alert(
                  "error",
                  "Fehler beim Erstellen des Nutzers",
                  "Es gab einen Fehler beim Erstellen des Nutzers. Vielleicht gibt es bereits einen Nutzer mit diesem Benutzernamen."
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

export default AddForm;
