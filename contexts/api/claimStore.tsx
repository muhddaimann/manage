import { create } from 'zustand';
import { getClaim, addClaim, withdrawClaim, type Claim, type ClaimResponse } from './claim';

type ClaimStore = {
  claims: Claim[];
  loading: boolean;
  fetchClaims: () => Promise<void>;
  addNewClaim: (formData: FormData) => Promise<ClaimResponse>;
  withdraw: (id: number) => Promise<void>;
};

export const useClaimStore = create<ClaimStore>((set, get) => ({
  claims: [],
  loading: false,

  fetchClaims: async () => {
    set({ loading: true });
    try {
      const data = await getClaim();
      set({ claims: data });
    } finally {
      set({ loading: false });
    }
  },

  addNewClaim: async (formData) => {
    const res = await addClaim(formData);
    if (res.claim_id) {
      await get().fetchClaims();
    }
    return res;
  },

  withdraw: async (id) => {
    await withdrawClaim(id);
    set((state) => ({
      claims: state.claims.map((c) =>
        c.claim_id === id ? { ...c, manager_status: 'Cancelled' } : c,
      ),
    }));
  },
}));
