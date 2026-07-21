import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "@/lib/api/client";
import { Booking, BookingStatus } from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface BookingsListQuery {
  page?: number;
  limit?: number;
  class_id?: string;
  member_id?: string;
  status?: BookingStatus | "";
  search?: string;
}

export interface BookingsListResponse {
  bookings: Booking[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BookingsState {
  list: Booking[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;
  mutating: boolean;
}

const initialState: BookingsState = {
  list: [],
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  listLoading: false,
  listError: null,
  mutating: false,
};

export const fetchBookings = createAsyncThunk<
  BookingsListResponse,
  BookingsListQuery | undefined,
  { rejectValue: string }
>("bookings/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    return await apiGet<BookingsListResponse>("/bookings", { params });
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load bookings."));
  }
});

export const createBooking = createAsyncThunk<
  { booking: Booking },
  { class_id: string; member_id: string },
  { rejectValue: string }
>("bookings/create", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ booking: Booking }>("/bookings", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to create booking."));
  }
});

export const cancelBooking = createAsyncThunk<
  { booking: Booking },
  string,
  { rejectValue: string }
>("bookings/cancel", async (id, { rejectWithValue }) => {
  try {
    return await apiPost<{ booking: Booking }>(`/bookings/${id}/cancel`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to cancel booking."));
  }
});

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
        state.list = [];
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.bookings;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load bookings.";
      })
      .addCase(createBooking.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.mutating = false;
        const idx = state.list.findIndex(
          (b) => b.id === action.payload.booking.id,
        );
        if (idx !== -1) {
          state.list[idx] = action.payload.booking;
        } else {
          state.list.unshift(action.payload.booking);
          state.total += 1;
        }
      })
      .addCase(createBooking.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (b) => b.id === action.payload.booking.id,
        );
        if (idx !== -1) state.list[idx] = action.payload.booking;

        if (action.payload.promoted) {
          const pIdx = state.list.findIndex(
            (b) => b.id === action.payload.promoted!.id,
          );
          if (pIdx !== -1) state.list[pIdx] = action.payload.promoted!;
        }
      });
  },
});

export default bookingsSlice.reducer;
