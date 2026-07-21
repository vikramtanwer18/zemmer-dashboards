import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { Plan } from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface PlansListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PlansListResponse {
  plans: Plan[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreatePlanPayload {
  name: string;
  price: number;
  duration_days: number;
  description?: string;
  max_freeze_days: number;
}

interface PlansState {
  list: Plan[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;

  current: Plan | null;
  detailLoading: boolean;
  detailError: string | null;

  mutating: boolean;
}

const initialState: PlansState = {
  list: [],
  page: 1,
  limit: 50,
  total: 0,
  totalPages: 0,
  listLoading: false,
  listError: null,
  current: null,
  detailLoading: false,
  detailError: null,
  mutating: false,
};

export const fetchPlans = createAsyncThunk<
  PlansListResponse,
  PlansListQuery | undefined,
  { rejectValue: string }
>("plans/fetchList", async (params = { limit: 50 }, { rejectWithValue }) => {
  try {
    return await apiGet<PlansListResponse>("/plans", { params });
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load plans."));
  }
});

export const fetchPlanById = createAsyncThunk<
  { plan: Plan },
  string,
  { rejectValue: string }
>("plans/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await apiGet<{ plan: Plan }>(`/plans/${id}`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load plan."));
  }
});

export const createPlan = createAsyncThunk<
  { plan: Plan },
  CreatePlanPayload,
  { rejectValue: string }
>("plans/create", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ plan: Plan }>("/plans", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to create plan."));
  }
});

export const updatePlan = createAsyncThunk<
  { plan: Plan },
  { id: string; patch: Partial<CreatePlanPayload> },
  { rejectValue: string }
>("plans/update", async ({ id, patch }, { rejectWithValue }) => {
  try {
    return await apiPatch<{ plan: Plan }>(`/plans/${id}`, patch);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to update plan."));
  }
});

export const deletePlan = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("plans/delete", async (id, { rejectWithValue }) => {
  try {
    await apiDelete(`/plans/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to delete plan."));
  }
});

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.plans;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load plans.";
      })
      .addCase(fetchPlanById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.plan;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? "Unable to load plan.";
      })
      .addCase(createPlan.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.mutating = false;
        state.list.unshift(action.payload.plan);
        state.total += 1;
      })
      .addCase(createPlan.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(updatePlan.pending, (state) => {
        state.mutating = true;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.mutating = false;
        const idx = state.list.findIndex(
          (p) => p.id === action.payload.plan.id,
        );
        if (idx !== -1) state.list[idx] = action.payload.plan;
        if (state.current?.id === action.payload.plan.id) {
          state.current = action.payload.plan;
        }
      })
      .addCase(updatePlan.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export default plansSlice.reducer;
