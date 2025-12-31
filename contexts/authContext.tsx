import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { router } from "expo-router";
import { OverlayContext } from "../contexts/overlayContext";

type User = { username: string } | null;

type AuthCtx = {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
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

  const { toast, confirm } = overlay;

  useEffect(() => {
    setBootstrapped(true);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setError(null);
      await new Promise((r) => setTimeout(r, 250));

      const ok = username === "user" && password === "123";

      if (ok) {
        setUser({ username });
        toast({ message: `Signed in as ${username}`, variant: "success" });
        router.replace("/welcome");
      } else {
        const msg = "Invalid credentials";
        setError(msg);
        toast({ message: msg, variant: "error" });
      }

      setLoading(false);
      return ok;
    },
    [toast]
  );

  const signOut = useCallback(async () => {
    const ok = await confirm({
      title: "Sign out?",
      message: "You’ll be logged out from this device.",
      okText: "Sign out",
      cancelText: "Cancel",
      variant: "warning",
    });
    if (!ok) return;

    setUser(null);
    setError(null);
    toast({ message: "Signed out", variant: "info" });
    router.replace("/goodbye");
  }, [confirm, toast]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      signIn,
      signOut,
      bootstrapped,
      clearError,
    }),
    [user, loading, error, signIn, signOut, bootstrapped, clearError]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
