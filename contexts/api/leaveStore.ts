import { create } from 'zustand';
import { getLeave, addLeave, withdrawLeave, type Leave, type LeaveResponse } from './leave';

type LeaveStore = {
  leaves: Leave[];
  loading: boolean;
  fetchLeaves: () => Promise<void>;
  addNewLeave: (formData: FormData) => Promise<LeaveResponse>;
  withdraw: (id: number) => Promise<void>;
};

export const useLeaveStore = create<LeaveStore>((set, get) => ({
  leaves: [],
  loading: false,

  fetchLeaves: async () => {
    set({ loading: true });
    try {
      const data = await getLeave();
      set({ leaves: data });
    } finally {
      set({ loading: false });
    }
  },

  addNewLeave: async (formData) => {
    const res = await addLeave(formData);
    if (res.leave_id) {
      await get().fetchLeaves();
    }
    return res;
  },

  withdraw: async (id) => {
    await withdrawLeave(id);
    set((state) => ({
      leaves: state.leaves.map((l) =>
        l.leave_id === id ? { ...l, manager_status: 'Cancelled' } : l,
      ),
    }));
  },
}));
