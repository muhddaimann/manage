import { create } from "zustand";
import { getStaffDetails, type StaffResponse } from "./staff";

type StaffStore = {
  staff: StaffResponse | null;
  loading: boolean;
  error: string | null;
  fetchStaff: () => Promise<void>;
  setStaff: (data: StaffResponse) => void;
  clearStaff: () => void;
};

export const useStaffStore = create<StaffStore>((set) => ({
  staff: null,
  loading: false,
  error: null,

  fetchStaff: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getStaffDetails();
      set({ staff: data, error: null });
    } catch (e: any) {
      set({
        staff: null,
        error: e?.message || "Failed to fetch staff details.",
      });
    } finally {
      set({ loading: false });
    }
  },

  setStaff: (data) => set({ staff: data }),
  clearStaff: () => set({ staff: null }),
}));
