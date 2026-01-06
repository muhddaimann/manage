import { create } from 'zustand';
import { getStaffDetails, type StaffResponse } from './staff';

type StaffStore = {
  staff: StaffResponse | null;
  loading: boolean;
  fetchStaff: () => Promise<void>;
  setStaff: (data: StaffResponse) => void;
  clearStaff: () => void;
};

export const useStaffStore = create<StaffStore>((set) => ({
  staff: null,
  loading: false,

  fetchStaff: async () => {
    set({ loading: true });
    try {
      const data = await getStaffDetails();
      set({ staff: data });
    } catch {
    } finally {
      set({ loading: false });
    }
  },

  setStaff: (data) => set({ staff: data }),
  clearStaff: () => set({ staff: null }),
}));
