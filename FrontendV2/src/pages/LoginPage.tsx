import { useState, useEffect } from "react";
import MyAlert from "../components/myChakra/MyAlert";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { setIsLoggedInAtom, triggerLogoutAtom } from "@/states/Atoms";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/Footer";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const LoginPage = () => {
  const { t } = useTranslation();

  const [isLoggedIn, setIsLoggedIn] = useAtom(setIsLoggedInAtom);
  const [triggerLogout, setTriggerLogout] = useAtom(triggerLogoutAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
      window.location.reload();                                                       // Mit Tobais besprechen, ob das so bleiben soll
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
        message: data.message ?? t("login-failed"),
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
    setTriggerLogout(false);
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
            <Card.Title>{t("login")}</Card.Title>
            <Card.Description>{t("enter-credentials")}</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap="4" w="full">
              <Field.Root>
                <Field.Label>{t("username")}</Field.Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>{t("password")}</Field.Label>
                <PasswordInput
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
              Login
            </Button>
          </Card.Footer>
          <Card.Footer justifyContent="flex-end">
            {triggerLogout && (
              <MyAlert
                status="success"
                title={t("logout-success")}
                description={t("logout-success-desc")}
              />
            )}
          </Card.Footer>
        </Card.Root>
      </form>
      <Footer />
    </div>
  );
};
