import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { GymClass } from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface ClassesListQuery {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  trainer_id?: string;
}

export interface ClassesListResponse {
  classes: GymClass[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateClassPayload {
  name: string;
  trainer_id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  description?: string;
}

interface ClassesState {
  list: GymClass[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;

  current: GymClass | null;
  detailLoading: boolean;
  detailError: string | null;

  mutating: boolean;
}

const initialState: ClassesState = {
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

export const fetchClasses = createAsyncThunk<
  ClassesListResponse,
  ClassesListQuery | undefined,
  { rejectValue: string }
>("classes/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    return await apiGet<ClassesListResponse>("/classes", { params });
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load classes."));
  }
});

export const fetchClassById = createAsyncThunk<
  { class: GymClass },
  string,
  { rejectValue: string }
>("classes/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await apiGet<{ class: GymClass }>(`/classes/${id}`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load class."));
  }
});

export const createClass = createAsyncThunk<
  { class: GymClass },
  CreateClassPayload,
  { rejectValue: string }
>("classes/create", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ class: GymClass }>("/classes", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to create class."));
  }
});

export const updateClass = createAsyncThunk<
  { class: GymClass },
  { id: string; patch: Partial<CreateClassPayload> },
  { rejectValue: string }
>("classes/update", async ({ id, patch }, { rejectWithValue }) => {
  try {
    return await apiPatch<{ class: GymClass }>(`/classes/${id}`, patch);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to update class."));
  }
});

export const deleteClass = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("classes/delete", async (id, { rejectWithValue }) => {
  try {
    await apiDelete(`/classes/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to delete class."));
  }
});

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.classes;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load classes.";
      })
      .addCase(fetchClassById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.class;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? "Unable to load class.";
      })
      .addCase(createClass.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.mutating = false;
        state.list.unshift(action.payload.class);
        state.total += 1;
      })
      .addCase(createClass.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (c) => c.id === action.payload.class.id,
        );
        if (idx !== -1) state.list[idx] = action.payload.class;
        if (state.current?.id === action.payload.class.id) {
          state.current = action.payload.class;
        }
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export default classesSlice.reducer;
