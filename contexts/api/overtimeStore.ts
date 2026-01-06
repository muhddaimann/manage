import { create } from 'zustand';
import {
  getOvertime,
  addOvertime,
  withdrawOvertime,
  type Overtime,
  type OvertimeResponse,
} from './overtime';

type OvertimeStore = {
  overtimes: Overtime[];
  loading: boolean;
  fetchOvertimes: () => Promise<void>;
  addNewOvertime: (data: Overtime) => Promise<OvertimeResponse>;
  withdraw: (id: number) => Promise<void>;
};

export const useOvertimeStore = create<OvertimeStore>((set, get) => ({
  overtimes: [],
  loading: false,

  fetchOvertimes: async () => {
    set({ loading: true });
    try {
      const data = await getOvertime();
      set({ overtimes: data });
    } finally {
      set({ loading: false });
    }
  },

  addNewOvertime: async (data) => {
    const res = await addOvertime(data);
    if (res.overtime_id) {
      await get().fetchOvertimes();
    }
    return res;
  },

  withdraw: async (id) => {
    await withdrawOvertime(id);
    set((state) => ({
      overtimes: state.overtimes.map((o) =>
        o.overtime_id === id ? { ...o, manager_status: 'Cancelled' } : o,
      ),
    }));
  },
}));
