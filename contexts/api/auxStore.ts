import { create } from 'zustand';
import { AuxData, getLatestAux, addAuxStatus } from './aux';

interface AuxStore {
  aux: AuxData | null;
  fetchAux: () => Promise<void>;
  updateAux: (activity: string) => Promise<void>;
}

export const useAuxStore = create<AuxStore>((set) => ({
  aux: null,
  fetchAux: async () => {
    const res = await getLatestAux();
    if (res.status === 'success' && res.data) {
      set({ aux: res.data });
    }
  },
  updateAux: async (activity) => {
    const res = await addAuxStatus({ ActivityType: activity });
    if (res.status === 'success') {
      const latest = await getLatestAux();
      if (latest.status === 'success' && latest.data) {
        set({ aux: latest.data });
      }
    }
  },
}));
