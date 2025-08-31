import React from "react";
import { Alert } from "@chakra-ui/react";

type MyAlertProps = {
  title: string;
  description: string;
};

const MyAlert: React.FC<MyAlertProps> = ({ title, description }) => {
  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
};

export default MyAlert;
