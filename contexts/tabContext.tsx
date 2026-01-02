import React, { createContext, useContext, useMemo, useState } from "react";

type TabCtx = {
  hideTabBar: boolean;
  setHideTabBar: (v: boolean) => void;
};

const Ctx = createContext<TabCtx>({
  hideTabBar: false,
  setHideTabBar: () => {},
});

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [hideTabBar, setHideTabBar] = useState(false);

  const value = useMemo(() => ({ hideTabBar, setHideTabBar }), [hideTabBar]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useTabs = () => useContext(Ctx);
