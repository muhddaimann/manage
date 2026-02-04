import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import FullScreenLoader from "../components/shared/fullScreenLoader";

type LoaderContextValue = {
  show: (message?: string) => void;
  hide: () => void;
};

export const LoaderContext = createContext<LoaderContextValue | null>(null);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const show = useCallback((msg?: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setMessage(undefined);
  }, []);

  const value = useMemo<LoaderContextValue>(() => ({ show, hide }), [show, hide]);

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <FullScreenLoader visible={visible} message={message} />
    </LoaderContext.Provider>
  );
}

export function useLoader(): LoaderContextValue {
  const ctx = useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoader must be used within LoaderProvider");
  }
  return ctx;
}
