import api from './api';

export interface LeaveBalanceItem {
  Type: string;
  TotalEntitlement: number;
  Balance: number;
  ReplacementLeave: number;
}

export type LeaveTypeCode =
  | 'AL' | 'SL' | 'UL' | 'RL' | 'MR'
  | 'PL' | 'CL' | 'ML' | 'CAL'
  | 'HL' | 'PGL' | 'PH' | 'GL';

export type LeaveBalanceMap = {
  [type in LeaveTypeCode]?: LeaveBalanceItem;
};

export interface ErrorResponse {
  error: string;
}

export const getAllLeaveBalances = async (): Promise<LeaveBalanceMap | ErrorResponse> => {
  try {
    const response = await api.get<LeaveBalanceMap | ErrorResponse>('/balance.php');
    if ('error' in response.data) return { error: response.data.error };
    return response.data;
  } catch {
    return { error: 'Error fetching leave balances.' };
  }
};

export const getLeaveBalanceByType = async (
  leaveType: LeaveTypeCode,
  startDate?: string,
  endDate?: string,
): Promise<LeaveBalanceItem | ErrorResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('leaveparam', leaveType);
    if (startDate) params.append('startparam', startDate);
    if (endDate) params.append('endparam', endDate);

    const response = await api.get<LeaveBalanceItem | ErrorResponse>(`/balance.php?${params}`);
    if ('error' in response.data) return { error: response.data.error };
    return response.data;
  } catch {
    return { error: 'Error fetching specific leave balance.' };
  }
};
