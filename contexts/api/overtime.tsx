import api from './api';

export type Overtime = {
  overtime_id: number;
  staff_id?: number;
  start_datetime: string;
  end_datetime: string;
  date: string;
  start: string;
  end: string;
  overtime_type: string;
  reason: string;
  remarks?: string;
  manager_status?: string;
  duration: string;
};

export type OvertimeResponse = {
  message?: string;
  overtime_id?: number;
  overtimeRecords?: Overtime[];
  error?: string;
};

export const getOvertime = async (): Promise<Overtime[]> => {
  try {
    const response = await api.get<Overtime[]>('/overtime.php');

    if (!Array.isArray(response.data)) {
      throw new Error('No overtime records found');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching overtime records:', error);
    throw error;
  }
};

export const addOvertime = async (data: Overtime): Promise<OvertimeResponse> => {
  try {
    const response = await api.post<OvertimeResponse>('/overtime.php', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    console.error('Error preparing overtime data:', error);
    throw error;
  }
};

export const withdrawOvertime = async (overtime_id: number): Promise<OvertimeResponse> => {
  try {
    const response = await api.post<OvertimeResponse>('/overtime.php?action=withdraw', { overtime_id });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    console.error('Error withdrawing overtime application:', error);
    throw error;
  }
};
