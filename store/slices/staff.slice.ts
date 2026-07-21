import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { Gender, InstructorType, StaffMember } from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface StaffListQuery {
  page?: number;
  limit?: number;
  instructorType?: InstructorType | "";
  sex?: Gender | "";
  search?: string;
}

export interface StaffListResponse {
  staff: StaffMember[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone: string;
  instructorType: InstructorType;
  hourlyPrice?: number;
  address?: string;
  dob?: string;
  sex?: Gender;
  bio?: string;
  certificate?: string;
}

interface StaffState {
  list: StaffMember[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;

  current: StaffMember | null;
  detailLoading: boolean;
  detailError: string | null;

  mutating: boolean;
}

const initialState: StaffState = {
  list: [],
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  listLoading: false,
  listError: null,
  current: null,
  detailLoading: false,
  detailError: null,
  mutating: false,
};

export const fetchStaff = createAsyncThunk<
  StaffListResponse,
  StaffListQuery | undefined,
  { rejectValue: string }
>("staff/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    return await apiGet<StaffListResponse>("/staff", { params });
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load staff."));
  }
});

export const fetchStaffById = createAsyncThunk<
  { staff: StaffMember },
  string,
  { rejectValue: string }
>("staff/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await apiGet<{ staff: StaffMember }>(`/staff/${id}`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load staff member."));
  }
});

export const createStaff = createAsyncThunk<
  { staff: StaffMember },
  CreateStaffPayload,
  { rejectValue: string }
>("staff/create", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ staff: StaffMember }>("/staff", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to create staff."));
  }
});

export const updateStaff = createAsyncThunk<
  { staff: StaffMember },
  { id: string; patch: Partial<CreateStaffPayload> },
  { rejectValue: string }
>("staff/update", async ({ id, patch }, { rejectWithValue }) => {
  try {
    return await apiPatch<{ staff: StaffMember }>(`/staff/${id}`, patch);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to update staff."));
  }
});

export const deleteStaff = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("staff/delete", async (id, { rejectWithValue }) => {
  try {
    await apiDelete(`/staff/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to delete staff."));
  }
});

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.staff;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load staff.";
      })
      .addCase(fetchStaffById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.staff;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? "Unable to load staff member.";
      })
      .addCase(createStaff.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.mutating = false;
        state.list.unshift(action.payload.staff);
        state.total += 1;
      })
      .addCase(createStaff.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (s) => s.id === action.payload.staff.id,
        );
        if (idx !== -1) state.list[idx] = action.payload.staff;
        if (state.current?.id === action.payload.staff.id) {
          state.current = action.payload.staff;
        }
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export default staffSlice.reducer;
