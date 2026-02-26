import React, {
  createContext,
  useContext,
  useMemo,
} from "react";
import { useOverlay } from "./overlayContext";

type PermissionState = "granted" | "denied" | "undetermined";

type NotificationContextType = {
  pushToken: string | null;
  permissionStatus: PermissionState;
  register: (manual?: boolean) => Promise<string | null>;
  unregister: () => Promise<void>;
};

const Ctx = createContext<NotificationContextType>({
  pushToken: null,
  permissionStatus: "undetermined",
  register: async () => null,
  unregister: async () => {},
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { alert } = useOverlay();

  const register = async (manual: boolean = false): Promise<string | null> => {
    if (manual) {
      alert({
        title: "Coming Soon",
        message: "Push notification module is on the way! Stay tuned for future updates.",
      });
    }
    return null;
  };

  const unregister = async () => {
    // No-op for now
  };

  const value = useMemo(
    () => ({
      pushToken: null,
      permissionStatus: "undetermined" as PermissionState,
      register,
      unregister,
    }),
    [alert],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useNotifications = () => useContext(Ctx);
