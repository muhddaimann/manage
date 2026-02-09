import { create } from 'zustand';
import { getLeave, addLeave, withdrawLeave, type Leave, type LeaveResponse } from './leave';

type LeaveStore = {
  leaves: Leave[];
  loading: boolean;
  submitting: boolean; // Add submitting state
  submissionError: string | null; // Add submission error state
  fetchLeaves: () => Promise<void>;
  addNewLeave: (formData: FormData) => Promise<LeaveResponse>;
  withdraw: (id: number) => Promise<void>;
};

export const useLeaveStore = create<LeaveStore>((set, get) => ({
  leaves: [],
  loading: false,
  submitting: false, // Initialize submitting state
  submissionError: null, // Initialize submissionError state

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
    set({ submitting: true, submissionError: null });
    try {
      const res = await addLeave(formData);
      if (res.leave_id) {
        await get().fetchLeaves();
        set({ submissionError: null });
        return { success: true, message: res.message };
      }
      // If no leave_id but no explicit error, implies a generic failure or incomplete success
      set({ submissionError: res.message || "Failed to add leave application." });
      return { success: false, error: res.message || "Failed to add leave application." };
    } catch (e: any) {
      const errorMessage = e?.message || "An unexpected error occurred during submission.";
      set({ submissionError: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ submitting: false });
    }
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
