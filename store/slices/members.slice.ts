import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { Member, MemberStatus } from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface MembersListQuery {
  page?: number;
  limit?: number;
  status?: MemberStatus | "";
  search?: string;
}

export interface MembersListResponse {
  members: Member[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MembersState {
  list: Member[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;

  current: Member | null;
  detailLoading: boolean;
  detailError: string | null;

  mutating: boolean;
}

const initialState: MembersState = {
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

export const fetchMembers = createAsyncThunk<
  MembersListResponse,
  MembersListQuery | undefined,
  { rejectValue: string }
>("members/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    const data = await apiGet<MembersListResponse>("/members", { params });
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load members."));
  }
});

export const fetchMemberById = createAsyncThunk<
  { member: Member },
  string,
  { rejectValue: string }
>("members/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await apiGet<{ member: Member }>(`/members/${id}`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load member."));
  }
});

export interface CreateMemberPayload {
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  gender?: Member["gender"];
  status?: MemberStatus;
  notes?: string;
}

export const createMember = createAsyncThunk<
  { member: Member },
  CreateMemberPayload,
  { rejectValue: string }
>("members/create", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ member: Member }>("/members", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to create member."));
  }
});

export const updateMember = createAsyncThunk<
  { member: Member },
  { id: string; patch: Partial<CreateMemberPayload> },
  { rejectValue: string }
>("members/update", async ({ id, patch }, { rejectWithValue }) => {
  try {
    return await apiPatch<{ member: Member }>(`/members/${id}`, patch);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to update member."));
  }
});

export const deleteMember = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("members/delete", async (id, { rejectWithValue }) => {
  try {
    await apiDelete(`/members/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to delete member."));
  }
});

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    resetCurrentMember(state) {
      state.current = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.members;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load members.";
      })
      .addCase(fetchMemberById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.member;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? "Unable to load member.";
      })
      .addCase(createMember.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.mutating = false;
        state.list.unshift(action.payload.member);
        state.total += 1;
      })
      .addCase(createMember.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(updateMember.pending, (state) => {
        state.mutating = true;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.mutating = false;
        const idx = state.list.findIndex(
          (m) => m.id === action.payload.member.id,
        );
        if (idx !== -1) state.list[idx] = action.payload.member;
        if (state.current?.id === action.payload.member.id) {
          state.current = action.payload.member;
        }
      })
      .addCase(updateMember.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.list = state.list.filter((m) => m.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { resetCurrentMember } = membersSlice.actions;
export default membersSlice.reducer;
