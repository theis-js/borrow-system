import { Alert, Stack, VStack, Spinner, Text, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { API_BASE } from "@/config/api.config";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

export const DeactivatedServices = () => {
  const { t } = useTranslation();

  const [deactivatedServices, setDeactivatedServices] = useState<
    { function_name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDeactivatedServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/api/users/deactivated-services`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token") || ""}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setDeactivatedServices(data);
        } else {
          console.error("Failed to fetch deactivated services");
        }
      } catch (error) {
        console.error("Error fetching deactivated services:", error);
      }
      setIsLoading(false);
    };

    fetchDeactivatedServices();
  }, []);

  return (
    <>
      {deactivatedServices.length >= 1 && (
        <Stack gap="2">
          <Heading size={"xl"}>{t("deactivated-services")}</Heading>
          {isLoading && (
            <VStack colorPalette="teal">
              <Spinner color="colorPalette.600" />
              <Text color="colorPalette.600">{t("loading")}</Text>
            </VStack>
          )}
          {deactivatedServices.length >= 1 &&
            deactivatedServices.map((item) => (
              <Alert.Root key={item.function_name} status="warning">
                <Alert.Indicator />
                <Alert.Title>
                  {item.function_name} {t("is-deactivated")}
                </Alert.Title>
              </Alert.Root>
            ))}
        </Stack>
      )}
    </>
  );
};
