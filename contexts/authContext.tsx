import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { router } from "expo-router";
import { OverlayContext } from "./overlayContext";
import { useToken } from "./tokenContext";

type User = { username: string } | null;

type AuthCtx = {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  forceRelogin: (reason?: string) => Promise<void>;
  bootstrapped: boolean;
  clearError: () => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  signIn: async () => false,
  signOut: async () => {},
  forceRelogin: async () => {},
  bootstrapped: false,
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlay = useContext(OverlayContext);
  if (!overlay) {
    throw new Error("AuthProvider must be used within OverlayProvider");
  }

  const { toast, destructiveConfirm } = overlay;

  const {
    token,
    setToken,
    clearToken,
    isExpired,
    bootstrapped: tokenReady,
  } = useToken();

  const clearError = useCallback(() => setError(null), []);

  const forceRelogin = useCallback(
    async (reason?: string) => {
      await clearToken();
      setUser(null);
      setError(null);

      toast({
        message: reason ?? "Session expired. Please sign in again.",
        variant: "warning",
      });

      router.replace("/");
      ``;
    },
    [clearToken, toast]
  );

  useEffect(() => {
    if (!tokenReady) return;

    if (token && !isExpired) {
      setUser({ username: "user" });
      router.replace("/welcome");
    } else if (token && isExpired) {
      forceRelogin("Session expired. Please sign in again.");
    }

    setBootstrapped(true);
  }, [tokenReady, token, isExpired, forceRelogin]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setError(null);

      await new Promise((r) => setTimeout(r, 250));

      const ok = username === "user" && password === "123";

      if (ok) {
        await setToken("jwt_like_token_here");
        setUser({ username });

        toast({
          message: `Signed in as ${username}`,
          variant: "success",
        });

        router.replace("/welcome");
      } else {
        const msg = "Invalid credentials";
        setError(msg);
        toast({ message: msg, variant: "error" });
      }

      setLoading(false);
      return ok;
    },
    [toast, setToken]
  );

  const signOut = useCallback(async () => {
    const ok = await destructiveConfirm({
      title: "Sign out",
      message: "You’ll be logged out from this device.",
      okText: "Sign out",
      cancelText: "Cancel",
    });

    if (!ok) return;

    await clearToken();
    setUser(null);
    setError(null);

    toast({ message: "Signed out", variant: "info" });
    router.replace("/goodbye");
  }, [destructiveConfirm, clearToken, toast]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      signIn,
      signOut,
      forceRelogin,
      bootstrapped,
      clearError,
    }),
    [
      user,
      loading,
      error,
      signIn,
      signOut,
      forceRelogin,
      bootstrapped,
      clearError,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
