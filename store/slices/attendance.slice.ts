import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "@/lib/api/client";
import { Attendance, AttendanceMethod } from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface AttendanceListQuery {
  page?: number;
  limit?: number;
  member_id?: string;
  method?: AttendanceMethod | "";
  from?: string;
  to?: string;
  open?: boolean;
}

export interface AttendanceListResponse {
  attendances: Attendance[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AttendanceState {
  list: Attendance[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;

  lastQrToken: { token: string; member_id: string; issuedAt: number } | null;
  mutating: boolean;
}

const initialState: AttendanceState = {
  list: [],
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  listLoading: false,
  listError: null,
  lastQrToken: null,
  mutating: false,
};

export const fetchAttendance = createAsyncThunk<
  AttendanceListResponse,
  AttendanceListQuery | undefined,
  { rejectValue: string }
>("attendance/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    return await apiGet<AttendanceListResponse>("/attendance", { params });
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load attendance."));
  }
});

export const generateQrToken = createAsyncThunk<
  { token: string; member_id: string },
  string,
  { rejectValue: string }
>("attendance/generateQr", async (memberId, { rejectWithValue }) => {
  try {
    const data = await apiGet<{ token: string }>(`/attendance/qr/${memberId}`);
    return { token: data.token, member_id: memberId };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to generate QR."));
  }
});

export const checkInWithQr = createAsyncThunk<
  { attendance: Attendance },
  { qrToken: string },
  { rejectValue: string }
>("attendance/checkInQr", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ attendance: Attendance }>(
      "/attendance/checkin/qr",
      payload,
    );
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Check-in failed."));
  }
});

export const checkInManual = createAsyncThunk<
  { attendance: Attendance },
  { member_id: string; method?: "MANUAL" | "BIOMETRIC" },
  { rejectValue: string }
>("attendance/checkInManual", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ attendance: Attendance }>(
      "/attendance/checkin/manual",
      { method: "MANUAL", ...payload },
    );
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Check-in failed."));
  }
});

export const checkOut = createAsyncThunk<
  { attendance: Attendance },
  string,
  { rejectValue: string }
>("attendance/checkOut", async (id, { rejectWithValue }) => {
  try {
    return await apiPost<{ attendance: Attendance }>(
      `/attendance/${id}/checkout`,
    );
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Check-out failed."));
  }
});

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.attendances;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load attendance.";
      })
      .addCase(generateQrToken.fulfilled, (state, action) => {
        state.lastQrToken = { ...action.payload, issuedAt: Date.now() };
      })
      .addCase(checkInWithQr.pending, (state) => {
        state.mutating = true;
      })
      .addCase(checkInWithQr.fulfilled, (state, action) => {
        state.mutating = false;
        state.list.unshift(action.payload.attendance);
      })
      .addCase(checkInWithQr.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(checkInManual.fulfilled, (state, action) => {
        state.list.unshift(action.payload.attendance);
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (a) => a.id === action.payload.attendance.id,
        );
        if (idx !== -1) state.list[idx] = action.payload.attendance;
      });
  },
});

export default attendanceSlice.reducer;
