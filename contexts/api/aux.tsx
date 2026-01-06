import api from './api';

export interface AuxData {
  ID: number;
  StaffID: number;
  Session: string;
  ActivityType: string;
  Start: string;
  End: string;
  IpAddress: string;
  BrowserAgent: string;
  ManualPlotBy?: string;
  ManualPlotDateTime?: string;
}

export interface AuxResponse {
  status: 'success' | 'error';
  message?: string;
  data?: AuxData;
}

export interface AuxPostRequest {
  ActivityType: string;
}

export const getLatestAux = async (): Promise<AuxResponse> => {
  try {
    const response = await api.get<AuxResponse>('/auxLive.php');
    return response.data;
  } catch (error) {
    console.error('Error fetching AUX data:', error);
    return {
      status: 'error',
      message: 'Failed to fetch AUX data',
    };
  }
};

export const addAuxStatus = async (data: AuxPostRequest): Promise<AuxResponse> => {
  try {
    const response = await api.post<AuxResponse>('/auxLive.php', data);
    return response.data;
  } catch (error) {
    console.error('Error adding AUX status:', error);
    return {
      status: 'error',
      message: 'Failed to add AUX status',
    };
  }
};
