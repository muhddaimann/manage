import { create } from "zustand";
import {
  getLeave,
  addLeave,
  withdrawLeave,
  type Leave,
} from "./leave";

export type StoreActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

type LeaveStore = {
  leaves: Leave[];
  loading: boolean;
  submitting: boolean;
  submissionError: string | null;
  fetchLeaves: () => Promise<void>;
  addNewLeave: (formData: FormData) => Promise<StoreActionResponse>;
  withdraw: (id: number) => Promise<StoreActionResponse>;
};

export const useLeaveStore = create<LeaveStore>((set, get) => ({
  leaves: [],
  loading: false,
  submitting: false,
  submissionError: null,

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
        return { success: true, message: res.message };
      }
      set({
        submissionError: res.message || "Failed to add leave application.",
      });
      return {
        success: false,
        error: res.message || "Failed to add leave application.",
      };
    } catch (e: any) {
      const errorMessage =
        e?.message || "An unexpected error occurred during submission.";
      set({ submissionError: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ submitting: false });
    }
  },

  withdraw: async (id: number): Promise<StoreActionResponse> => {
    set({ submitting: true, submissionError: null });
    try {
      const res = await withdrawLeave(id);
      // Explicitly check for an error property in the response
      if (res.error) {
        set({ submissionError: res.error });
        return { success: false, error: res.error };
      }
      // On success, refetch the leaves and return a success response
      await get().fetchLeaves();
      return { success: true, message: res.message };
    } catch (e: any) {
      const errorMessage =
        e?.message || "An unexpected error occurred during withdrawal.";
      set({ submissionError: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ submitting: false });
    }
  },

  clear: () =>
    set({
      leaves: [],
      loading: false,
      submitting: false,
      submissionError: null,
    }),
}));
