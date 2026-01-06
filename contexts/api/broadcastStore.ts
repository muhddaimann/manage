import { create } from 'zustand';

export interface Broadcast {
  broadcast_id: number;
  BroadcastType: string;
  BroadcastPriority: string;
  NewsName: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Content: string;
  CreatedBy: string;
  CreatedDateTime: string;
}

interface BroadcastStore {
  selectedBroadcast: Broadcast | null;
  setBroadcast: (broadcast: Broadcast) => void;
  clearBroadcast: () => void;
}

export const useBroadcastStore = create<BroadcastStore>((set) => ({
  selectedBroadcast: null,
  setBroadcast: (broadcast) => set({ selectedBroadcast: broadcast }),
  clearBroadcast: () => set({ selectedBroadcast: null }),
}));
