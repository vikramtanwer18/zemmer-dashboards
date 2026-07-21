import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { Membership, MembershipStatus } from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface MembershipsListQuery {
  page?: number;
  limit?: number;
  status?: MembershipStatus | "";
  expiringInDays?: number;
  member_id?: string;
}

export interface MembershipsListResponse {
  memberships: Membership[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MembershipsState {
  list: Membership[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;

  current: Membership | null;
  detailLoading: boolean;
  detailError: string | null;

  mutating: boolean;
}

const initialState: MembershipsState = {
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

export const fetchMemberships = createAsyncThunk<
  MembershipsListResponse,
  MembershipsListQuery | undefined,
  { rejectValue: string }
>("memberships/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    return await apiGet<MembershipsListResponse>("/memberships", { params });
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to load memberships."),
    );
  }
});

export const fetchMembershipById = createAsyncThunk<
  { membership: Membership },
  string,
  { rejectValue: string }
>("memberships/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await apiGet<{ membership: Membership }>(`/memberships/${id}`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load membership."));
  }
});

export interface CreateMembershipPayload {
  member_id: string;
  plan_id: string;
  start_date: string;
  status?: MembershipStatus;
}

export const createMembership = createAsyncThunk<
  { membership: Membership },
  CreateMembershipPayload,
  { rejectValue: string }
>("memberships/create", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ membership: Membership }>("/memberships", payload);
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to create membership."),
    );
  }
});

export const updateMembership = createAsyncThunk<
  { membership: Membership },
  { id: string; patch: Partial<CreateMembershipPayload> },
  { rejectValue: string }
>("memberships/update", async ({ id, patch }, { rejectWithValue }) => {
  try {
    return await apiPatch<{ membership: Membership }>(
      `/memberships/${id}`,
      patch,
    );
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to update membership."),
    );
  }
});

export const freezeMembership = createAsyncThunk<
  { membership: Membership },
  { id: string; duration_days: number; reason?: string },
  { rejectValue: string }
>("memberships/freeze", async ({ id, ...body }, { rejectWithValue }) => {
  try {
    return await apiPost<{ membership: Membership }>(
      `/memberships/${id}/freeze`,
      body,
    );
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to freeze membership."),
    );
  }
});

export const unfreezeMembership = createAsyncThunk<
  { membership: Membership },
  string,
  { rejectValue: string }
>("memberships/unfreeze", async (id, { rejectWithValue }) => {
  try {
    return await apiPost<{ membership: Membership }>(
      `/memberships/${id}/unfreeze`,
    );
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to unfreeze membership."),
    );
  }
});

export const deleteMembership = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("memberships/delete", async (id, { rejectWithValue }) => {
  try {
    await apiDelete(`/memberships/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to delete membership."),
    );
  }
});

const membershipsSlice = createSlice({
  name: "memberships",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const upsert = (state: MembershipsState, m: Membership) => {
      const idx = state.list.findIndex((x) => x.id === m.id);
      if (idx !== -1) state.list[idx] = m;
      if (state.current?.id === m.id) state.current = m;
    };

    builder
      .addCase(fetchMemberships.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchMemberships.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.memberships;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMemberships.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load memberships.";
      })
      .addCase(fetchMembershipById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchMembershipById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.membership;
      })
      .addCase(fetchMembershipById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? "Unable to load membership.";
      })
      .addCase(createMembership.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createMembership.fulfilled, (state, action) => {
        state.mutating = false;
        state.list.unshift(action.payload.membership);
      })
      .addCase(createMembership.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(updateMembership.fulfilled, (state, action) => {
        upsert(state, action.payload.membership);
      })
      .addCase(freezeMembership.fulfilled, (state, action) => {
        upsert(state, action.payload.membership);
      })
      .addCase(unfreezeMembership.fulfilled, (state, action) => {
        upsert(state, action.payload.membership);
      })
      .addCase(deleteMembership.fulfilled, (state, action) => {
        state.list = state.list.filter((m) => m.id !== action.payload);
      });
  },
});

export default membershipsSlice.reducer;
