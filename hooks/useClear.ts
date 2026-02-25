import { useBalanceStore } from "../contexts/api/balanceStore";
import { useBroadcastStore } from "../contexts/api/broadcastStore";
import { useLeaveStore } from "../contexts/api/leaveStore";
import { useRoomStore } from "../contexts/api/roomStore";
import { useStaffStore } from "../contexts/api/staffStore";

export function useClear() {
  const clearBalance = useBalanceStore((state) => state.clear);
  const clearBroadcast = useBroadcastStore((state) => state.clear);
  const clearLeave = useLeaveStore((state) => state.clear);
  const clearRoom = useRoomStore((state) => state.clear);
  const clearStaff = useStaffStore((state) => state.clear);

  const clearAll = () => {
    console.log("Clearing all stores...");
    clearBalance();
    clearBroadcast();
    clearLeave();
    clearRoom();
    clearStaff();
    console.log("All stores cleared.");
  };

  return { clearAll };
}
