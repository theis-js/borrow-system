import { useState, useEffect } from "react";
import MyAlert from "../components/myChakra/MyAlert";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { setIsLoggedInAtom } from "@/states/Atoms";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(setIsLoggedInAtom);
  const navigate = useNavigate();
  console.log(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const loginFnc = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message ?? "Login fehlgeschlagen",
        description: data.description ?? "",
      };
    }

    Cookies.set("token", data.token);
    setIsLoggedIn(true);
    return { success: true };
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorDsc, setErrorDsc] = useState("");

  const handleLogin = async () => {
    const result = await loginFnc(username, password);
    if (!result.success) {
      setErrorMsg(result.message);
      setErrorDsc(result.description);
      setIsError(true);
      return;
    }
    navigate("/", { replace: true });
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <Card.Root maxW="sm">
          <Card.Header>
            <Card.Title>Login</Card.Title>
            <Card.Description>
              Bitte unten Ihre Zugangsdaten eingeben.
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
            {isError && (
              <MyAlert status="error" title={errorMsg} description={errorDsc} />
            )}
            <Button type="submit" onClick={() => handleLogin()} variant="solid">
              Login <p>{isLoggedIn}</p>
            </Button>
          </Card.Footer>
        </Card.Root>
      </form>
    </div>
  );
};
