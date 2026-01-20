import api from "./api";

/* =======================
   TYPES
======================= */

export type LeaveTypeCode =
  | "AL"
  | "SL"
  | "UL"
  | "RP"
  | "MR"
  | "PL"
  | "CL"
  | "ML"
  | "CML"
  | "HL"
  | "VACCINCE"
  | "PH"
  | "GL";

export interface LeaveBalanceResponse {
  leave_type: LeaveTypeCode;
  month: string; // YYYY-MM
  entitlement: number;
  approved: number;
  pending: number;
  balance: number;
}

export interface ErrorResponse {
  error: string;
}

/* =======================
   API CALL
======================= */

export const getLeaveBalance = async (
  leaveType: LeaveTypeCode,
  month?: string
): Promise<LeaveBalanceResponse | ErrorResponse> => {
  try {
    const params: Record<string, string> = {
      leave_type: leaveType,
    };

    if (month) {
      params.month = month; // YYYY-MM
    }

    const response = await api.get<LeaveBalanceResponse | ErrorResponse>(
      "/balance.php",
      { params }
    );

    if ("error" in response.data) {
      return { error: response.data.error };
    }

    return response.data;
  } catch {
    return { error: "Error fetching leave balance." };
  }
};
``