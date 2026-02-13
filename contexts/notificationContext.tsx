import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { useToken } from "../contexts/tokenContext";
import {
  registerForPushNotificationsAsync as registerForPushApi,
  sendTokenToBackend,
  removeTokenFromBackend,
} from "../contexts/api/push";

const PUSH_TOKEN_KEY = "expo_push_token";

type PermissionState = "granted" | "denied" | "undetermined";

type NotificationContextType = {
  pushToken: string | null;
  permissionStatus: PermissionState;
  register: () => Promise<string | null>;
  unregister: () => Promise<void>;
};

const Ctx = createContext<NotificationContextType>({
  pushToken: null,
  permissionStatus: "undetermined",
  register: async () => null,
  unregister: async () => {},
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState>("undetermined");

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const { token: authToken } = useToken();

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status as PermissionState);

      const storedToken = await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
      setPushToken(storedToken ?? null);
    })();

    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {});

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => {});

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const register = useCallback(async (): Promise<string | null> => {
    const token = await registerForPushApi();
    const normalized = token ?? null;

    if (normalized) {
      setPushToken(normalized);
      await SecureStore.setItemAsync(PUSH_TOKEN_KEY, normalized);

      if (authToken) {
        await sendTokenToBackend(normalized, authToken);
      }
    }

    return normalized;
  }, [authToken]);

  const unregister = useCallback(async () => {
    const storedToken = await SecureStore.getItemAsync(PUSH_TOKEN_KEY);

    if (storedToken) {
      if (authToken) {
        await removeTokenFromBackend(storedToken, authToken);
      }

      await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
    }

    setPushToken(null);
  }, [authToken]);

  const value = useMemo(
    () => ({
      pushToken,
      permissionStatus,
      register,
      unregister,
    }),
    [pushToken, permissionStatus, register, unregister],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useNotifications = () => useContext(Ctx);
