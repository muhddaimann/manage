import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const TOKEN_TS_KEY = "auth_token_issued_at";
const MAX_AGE_DAYS = 30;

type TokenCtx = {
  token: string | null;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
  isExpired: boolean;
  bootstrapped: boolean;
};

const Ctx = createContext<TokenCtx>({
  token: null,
  setToken: async () => {},
  clearToken: async () => {},
  isExpired: true,
  bootstrapped: false,
});

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [issuedAt, setIssuedAt] = useState<number | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await SecureStore.getItemAsync(TOKEN_KEY);
      const ts = await SecureStore.getItemAsync(TOKEN_TS_KEY);

      setTokenState(t);
      setIssuedAt(ts ? Number(ts) : null);
      setBootstrapped(true);
    })();
  }, []);

  const setToken = useCallback(async (t: string) => {
    const now = Date.now();
    await SecureStore.setItemAsync(TOKEN_KEY, t);
    await SecureStore.setItemAsync(TOKEN_TS_KEY, String(now));
    setTokenState(t);
    setIssuedAt(now);
  }, []);

  const clearToken = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_TS_KEY);
    setTokenState(null);
    setIssuedAt(null);
  }, []);

  const isExpired = useMemo(() => {
    if (!token || !issuedAt) return true;
    const ageDays = (Date.now() - issuedAt) / (1000 * 60 * 60 * 24);
    return ageDays >= MAX_AGE_DAYS;
  }, [token, issuedAt]);

  const value = useMemo(
    () => ({
      token,
      setToken,
      clearToken,
      isExpired,
      bootstrapped,
    }),
    [token, setToken, clearToken, isExpired, bootstrapped]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useToken = () => useContext(Ctx);
