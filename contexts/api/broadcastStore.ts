import { create } from "zustand";

export interface Broadcast {
  ID: number;
  BroadcastType: string;
  BroadcastPriority: string;
  NewsName: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Content: string;
  CreatedBy: string;
  CreatedDateTime: string;
  Acknowledged: number;
}

interface BroadcastStore {
  broadcasts: Broadcast[];
  selectedBroadcast: Broadcast | null;

  setBroadcasts: (data: Broadcast[]) => void;
  setBroadcast: (broadcast: Broadcast) => void;
  clearBroadcast: () => void;

  markAcknowledged: (id: number) => void;
}

export const useBroadcastStore = create<BroadcastStore>((set) => ({
  broadcasts: [],
  selectedBroadcast: null,

  setBroadcasts: (data) => set({ broadcasts: data }),

  setBroadcast: (broadcast) => set({ selectedBroadcast: broadcast }),

  clearBroadcast: () => set({ selectedBroadcast: null }),

  markAcknowledged: (id) =>
    set((state) => ({
      broadcasts: state.broadcasts.map((b) =>
        b.ID === id ? { ...b, Acknowledged: 1 } : b,
      ),
      selectedBroadcast:
        state.selectedBroadcast?.ID === id
          ? { ...state.selectedBroadcast, Acknowledged: 1 }
          : state.selectedBroadcast,
    })),

  clear: () => set({ broadcasts: [], selectedBroadcast: null }),
}));
