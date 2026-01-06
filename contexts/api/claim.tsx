import api from './api';

export type Claim = {
  claim_id?: number;
  claim_type: string;
  invoice_date: string;
  date: string;
  amount: number;
  amountRM: number;
  document_id: string;
  remarks: string;
  document_url: string;
  manager_status?: string;
};

export type ClaimResponse = {
  message?: string;
  claimRecords?: Claim[];
  claim_id?: number;
  error?: string;
};

export const getClaim = async (): Promise<Claim[]> => {
  try {
    const response = await api.get<Claim[]>('/claim.php');

    if (!Array.isArray(response.data)) {
      throw new Error('No claim records found');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching claim records:', error);
    throw error;
  }
};

export const addClaim = async (formData: FormData): Promise<ClaimResponse> => {
  try {
    const response = await api.post<ClaimResponse>('/claim.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    console.error('Error adding claim:', error);
    throw error;
  }
};

export const withdrawClaim = async (claim_id: number): Promise<ClaimResponse> => {
  try {
    const response = await api.post<ClaimResponse>('/claim.php?action=withdraw', { claim_id });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    console.error('Error withdrawing claim:', error);
    throw error;
  }
};
