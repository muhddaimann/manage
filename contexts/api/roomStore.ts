import { create } from 'zustand';
import {
  BookingItem,
  BookingResponse,
  bookRoom as bookRoomApi,
  getMyBookings as getMyBookingsApi,
  cancelBooking as cancelBookingApi,
  ErrorResponse,
  CancelBookingResponse,
} from '../api/room';

interface RoomState {
  myBookings: BookingItem[];
  loading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  createBooking: (
    bookDate: string,
    startTime: string,
    endTime: string,
    room: string,
    tower: string,
    level: string,
    purpose: string,
    PIC: string,
    email: string,
  ) => Promise<BookingResponse | ErrorResponse>;

  cancelBooking: (bookingNumber: string) => Promise<CancelBookingResponse>;
}

export const useRoomStore = create<RoomState>((set) => ({
  myBookings: [],
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    const res = await getMyBookingsApi();
    if ('error' in res) {
      set({ error: res.error, myBookings: [], loading: false });
    } else {
      set({ myBookings: res, loading: false });
    }
  },

  createBooking: async (bookDate, startTime, endTime, room, tower, level, purpose, PIC, email) => {
    set({ loading: true, error: null });
    const res = await bookRoomApi(
      bookDate,
      startTime,
      endTime,
      room,
      tower,
      level,
      purpose,
      PIC,
      email,
    );
    if ('error' in res) {
      set({ error: res.error, loading: false });
    } else {
      set({ error: null });
      await useRoomStore.getState().fetchBookings();
    }
    set({ loading: false });
    return res;
  },

    cancelBooking: async (bookingNumber) => {
      set({ loading: true, error: null });
      const res = await cancelBookingApi(bookingNumber);
      if (!res.execute_success) {
        set({ error: 'Failed to cancel booking.', loading: false });
      } else {
        await useRoomStore.getState().fetchBookings();
        set({ error: null });
      }
      set({ loading: false });
      return res;
    },

  clear: () => set({ myBookings: [], loading: false, error: null }),
}));
