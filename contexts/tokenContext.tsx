import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";

export type TokenCtx = {
  token: string | null;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
  isExpired: () => boolean;
  bootstrapped: boolean;
};

const Ctx = createContext<TokenCtx | null>(null);

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearStoredToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const t = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!mounted) return;
      setTokenState(t);
      setBootstrapped(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const setToken = useCallback(async (t: string) => {
    await setStoredToken(t);
    setTokenState(t);
  }, []);

  const clearToken = useCallback(async () => {
    await clearStoredToken();
    setTokenState(null);
  }, []);

  const isExpired = useCallback(() => {
    if (!token) return true;
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded?.exp) return false;
      return Date.now() > decoded.exp * 1000;
    } catch {
      return true;
    }
  }, [token]);

  const value = useMemo<TokenCtx>(
    () => ({
      token,
      setToken,
      clearToken,
      isExpired,
      bootstrapped,
    }),
    [token, setToken, clearToken, isExpired, bootstrapped],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useToken(): TokenCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useToken must be used within TokenProvider");
  }
  return ctx;
}
