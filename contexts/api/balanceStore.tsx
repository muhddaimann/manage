import { create } from "zustand";
import { getLeaveBalance } from "./balance";

type BalanceStore = {
  annualLeaveLeft: number;
  balanceLoading: boolean;
  fetchBalance: () => Promise<void>;
};

export const useBalanceStore = create<BalanceStore>((set) => ({
  annualLeaveLeft: 0,
  balanceLoading: true,
  fetchBalance: async () => {
    set({ balanceLoading: true });
    try {
      const month = new Date().toISOString().slice(0, 7);
      const res = await getLeaveBalance(month);
      if (!("error" in res)) {
        set({ annualLeaveLeft: res.balance });
      }
    } finally {
      set({ balanceLoading: false });
    }
  },
}));
