import React from "react";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { createItem } from "@/utils/userActions";

type AddItemFormProps = {
  onClose: () => void;
  alert: (
    status: "success" | "error",
    message: string,
    description: string
  ) => void;
};

const AddItemForm: React.FC<AddItemFormProps> = ({ onClose, alert }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Title>Neuen Gegenstand erstellen</Card.Title>
          <Card.Description>
            Füllen Sie das folgende Formular aus, um einen Gegenstand zu
            erstellen.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root>
              <Field.Label>Gegenstandsname (muss einzigartig sein)</Field.Label>
              <Input id="item_name" placeholder="z.B. Laptop" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Schließfachnummer (immer zwei Zahlen)</Field.Label>
              <Input id="safe_nr" placeholder="Nummer 01 - 06" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Ausleih-Berechtigung (Rolle)</Field.Label>
              <Input
                id="can_borrow_role"
                type="number"
                placeholder="Zahl (1 - 6)"
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
              const name =
                (
                  document.getElementById("item_name") as HTMLInputElement
                )?.value.trim() || "";
              const role = Number(
                (document.getElementById("can_borrow_role") as HTMLInputElement)
                  ?.value
              );
              const safeNrValue = (
                document.getElementById("safe_nr") as HTMLInputElement
              )?.value.trim();

              const safeNr = safeNrValue === "" ? null : safeNrValue;

              if (!name || Number.isNaN(role)) return;
              if (safeNr !== null && !/^\d{2}$/.test(safeNr)) return;

              const res = await createItem(name, role, safeNr);
              if (res.success) {
                alert(
                  "success",
                  "Gegenstand erstellt",
                  "Der Gegenstand wurde erfolgreich erstellt."
                );
                onClose();
              } else {
                alert(
                  "error",
                  "Fehler",
                  res.message ||
                    "Der Gegenstand konnte nicht erstellt werden. (frontend bug)"
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

export default AddItemForm;
