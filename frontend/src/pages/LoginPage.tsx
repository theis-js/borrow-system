import { useState, useEffect } from "react";
import MyAlert from "../components/myChakra/MyAlert";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { setIsLoggedInAtom, triggerLogoutAtom } from "@/states/Atoms";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslation } from "react-i18next";
import { API_BASE } from "@/config/api.config";
import { unlockAnimation } from "@/components/dotLottie";
import { logoutAnimation } from "@/components/dotLottie";

export const LoginPage = () => {
  const { t } = useTranslation();

  const [isLoggedIn, setIsLoggedIn] = useAtom(setIsLoggedInAtom);
  const [triggerLogout, setTriggerLogout] = useAtom(triggerLogoutAtom);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (triggerLogout) {
      setShowLogout(true);
      window.setTimeout(() => {
        setShowLogout(false);
      }, 4500);
    }

    if (!isLoggedIn) return;

    // Existing sessions should redirect immediately, fresh logins wait for animation.
    if (!showAnimation) {
      navigate(from, { replace: true });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate(from, { replace: true });
      window.location.reload(); // keeps user context in sync after login
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [isLoggedIn, showAnimation, navigate, from]);

  const loginFnc = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/api/users/login`, {
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

    setShowAnimation(true);

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
  };

  return (
    <>
      {showAnimation && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
          <div>{unlockAnimation()}</div>
        </div>
      )}

      {showLogout && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
          <div>{logoutAnimation()}</div>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center p-4">
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
                <MyAlert
                  status="error"
                  title={errorMsg}
                  description={errorDsc}
                />
              )}
              <Button
                type="submit"
                onClick={() => handleLogin()}
                variant="solid"
              >
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
      </div>
    </>
  );
};
