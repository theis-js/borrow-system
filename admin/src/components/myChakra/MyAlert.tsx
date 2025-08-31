import React from "react";
import { Alert } from "@chakra-ui/react";

type MyAlertProps = {
  status: "error" | "success";
  title: string;
  description: string;
};

const MyAlert: React.FC<MyAlertProps> = ({ title, description, status }) => {
  return (
    <Alert.Root status={status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
};

export default MyAlert;
