import React, { createContext, useContext, useMemo, useState } from "react";
import {
  createDesignTokens,
  design as defaultDesign,
  type DesignTokens,
} from "../constants/design";

type DesignCtx = {
  tokens: DesignTokens;
  scale: number;
  setScale: (n: number) => void;
};

const Ctx = createContext<DesignCtx>({
  tokens: defaultDesign,
  scale: 1,
  setScale: () => {},
});

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState<number>(1);
  const tokens = useMemo(() => createDesignTokens(scale), [scale]);

  const value = useMemo<DesignCtx>(
    () => ({ tokens, scale, setScale }),
    [tokens, scale]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useDesign = () => useContext(Ctx);
