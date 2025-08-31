import React from "react";
import { useState } from "react";
import { loginFunc } from "@/utils/loginUser";
import MyAlert from "@/components/myChakra/MyAlert";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";

const Login: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorDsc, setErrorDsc] = useState("");

  const handleLogin = async () => {
    const result = await loginFunc(username, password);
    if (!result.success) {
      setErrorMsg(result.message);
      setErrorDsc(result.description);
      setIsError(true);
      return;
    }
    onSuccess();
  };

  return (
    <Card.Root maxW="sm">
      <Card.Header>
        <Card.Title>Login</Card.Title>
        <Card.Description>
          Bitte unten Ihre Admin Zugangsdaten eingeben.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="4" w="full">
          <Field.Root>
            <Field.Label>username</Field.Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        {isError && <MyAlert title={errorMsg} description={errorDsc} />}
        <Button onClick={() => handleLogin()} variant="solid">
          Login
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default Login;
