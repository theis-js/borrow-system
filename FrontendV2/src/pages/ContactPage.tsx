import { Field, Textarea } from "@chakra-ui/react"

export const ContactPage = () => {
  return (
    <Field.Root invalid>
      <Field.Label>
        Comment <Field.RequiredIndicator />
      </Field.Label>
      <Textarea placeholder="Start typing..." variant="subtle" />
      <Field.ErrorText>Field is required</Field.ErrorText>
    </Field.Root>
  );
};
