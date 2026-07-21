import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import {
  FollowUp,
  Lead,
  LeadActivity,
  LeadActivityType,
  LeadSource,
  LeadStage,
  Member,
} from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface LeadsListQuery {
  page?: number;
  limit?: number;
  stage?: LeadStage | "";
  source?: LeadSource | "";
  assignedTo?: string;
  search?: string;
}

export interface LeadsListResponse {
  leads: Lead[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateLeadPayload {
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  stage?: LeadStage;
  notes?: string;
  assignedTo?: string;
}

interface LeadsState {
  list: Lead[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;

  current: Lead | null;
  detailLoading: boolean;
  detailError: string | null;

  activities: LeadActivity[];
  activitiesLoading: boolean;

  upcomingFollowups: FollowUp[];
  followupsLoading: boolean;

  mutating: boolean;
}

const initialState: LeadsState = {
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
  activities: [],
  activitiesLoading: false,
  upcomingFollowups: [],
  followupsLoading: false,
  mutating: false,
};

export const fetchLeads = createAsyncThunk<
  LeadsListResponse,
  LeadsListQuery | undefined,
  { rejectValue: string }
>("leads/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    return await apiGet<LeadsListResponse>("/leads", { params });
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load leads."));
  }
});

export const fetchLeadById = createAsyncThunk<
  { lead: Lead },
  string,
  { rejectValue: string }
>("leads/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await apiGet<{ lead: Lead }>(`/leads/${id}`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load lead."));
  }
});

export const createLead = createAsyncThunk<
  { lead: Lead },
  CreateLeadPayload,
  { rejectValue: string }
>("leads/create", async (payload, { rejectWithValue }) => {
  try {
    return await apiPost<{ lead: Lead }>("/leads", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to create lead."));
  }
});

export const updateLead = createAsyncThunk<
  { lead: Lead },
  { id: string; patch: Partial<CreateLeadPayload> },
  { rejectValue: string }
>("leads/update", async ({ id, patch }, { rejectWithValue }) => {
  try {
    return await apiPatch<{ lead: Lead }>(`/leads/${id}`, patch);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to update lead."));
  }
});

export const changeLeadStage = createAsyncThunk<
  { lead: Lead },
  { id: string; stage: LeadStage; note?: string },
  { rejectValue: string }
>("leads/changeStage", async ({ id, ...body }, { rejectWithValue }) => {
  try {
    return await apiPatch<{ lead: Lead }>(`/leads/${id}/stage`, body);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to change stage."));
  }
});

export const convertLead = createAsyncThunk<
  { lead: Lead; member: Member },
  {
    id: string;
    gender?: "MALE" | "FEMALE" | "OTHERS";
    dob?: string;
    notes?: string;
  },
  { rejectValue: string }
>("leads/convert", async ({ id, ...body }, { rejectWithValue }) => {
  try {
    return await apiPost<{ lead: Lead; member: Member }>(
      `/leads/${id}/convert`,
      body,
    );
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to convert lead."));
  }
});

export const deleteLead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("leads/delete", async (id, { rejectWithValue }) => {
  try {
    await apiDelete(`/leads/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to delete lead."));
  }
});

export const fetchLeadActivities = createAsyncThunk<
  { activities: LeadActivity[] },
  string,
  { rejectValue: string }
>("leads/fetchActivities", async (leadId, { rejectWithValue }) => {
  try {
    return await apiGet<{ activities: LeadActivity[] }>(
      `/leads/${leadId}/activities`,
    );
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load activities."));
  }
});

export const addLeadActivity = createAsyncThunk<
  { activity: LeadActivity },
  {
    leadId: string;
    type: LeadActivityType;
    payload?: Record<string, unknown>;
  },
  { rejectValue: string }
>("leads/addActivity", async ({ leadId, ...body }, { rejectWithValue }) => {
  try {
    return await apiPost<{ activity: LeadActivity }>(
      `/leads/${leadId}/activities`,
      body,
    );
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to add activity."));
  }
});

export const createFollowup = createAsyncThunk<
  { followup: FollowUp },
  { leadId: string; followup_at: string; note?: string },
  { rejectValue: string }
>("leads/createFollowup", async ({ leadId, ...body }, { rejectWithValue }) => {
  try {
    return await apiPost<{ followup: FollowUp }>(
      `/leads/${leadId}/followups`,
      body,
    );
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to schedule follow-up."),
    );
  }
});

export const fetchUpcomingFollowups = createAsyncThunk<
  { followups: FollowUp[] },
  { days?: number } | undefined,
  { rejectValue: string }
>("leads/upcomingFollowups", async (params = { days: 7 }, { rejectWithValue }) => {
  try {
    return await apiGet<{ followups: FollowUp[] }>(
      "/leads/followups/upcoming",
      { params },
    );
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to load follow-ups."),
    );
  }
});

export const updateFollowup = createAsyncThunk<
  { followup: FollowUp },
  { id: string; patch: { is_done?: boolean; note?: string; followup_at?: string } },
  { rejectValue: string }
>("leads/updateFollowup", async ({ id, patch }, { rejectWithValue }) => {
  try {
    return await apiPatch<{ followup: FollowUp }>(
      `/leads/followups/${id}`,
      patch,
    );
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to update follow-up."),
    );
  }
});

export const deleteFollowup = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("leads/deleteFollowup", async (id, { rejectWithValue }) => {
  try {
    await apiDelete(`/leads/followups/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to delete follow-up."),
    );
  }
});

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    optimisticallySetLeadStage(
      state,
      action: { payload: { id: string; stage: LeadStage } },
    ) {
      const { id, stage } = action.payload;
      const idx = state.list.findIndex((l) => l.id === id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], stage };
      if (state.current?.id === id) {
        state.current = { ...state.current, stage };
      }
    },
  },
  extraReducers: (builder) => {
    const upsertLead = (state: LeadsState, lead: Lead) => {
      const idx = state.list.findIndex((l) => l.id === lead.id);
      if (idx !== -1) state.list[idx] = lead;
      if (state.current?.id === lead.id) state.current = lead;
    };

    builder
      .addCase(fetchLeads.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.leads;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load leads.";
      })
      .addCase(fetchLeadById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.lead;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? "Unable to load lead.";
      })
      .addCase(createLead.pending, (state) => {
        state.mutating = true;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.mutating = false;
        state.list.unshift(action.payload.lead);
        state.total += 1;
      })
      .addCase(createLead.rejected, (state) => {
        state.mutating = false;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        upsertLead(state, action.payload.lead);
      })
      .addCase(changeLeadStage.fulfilled, (state, action) => {
        upsertLead(state, action.payload.lead);
      })
      .addCase(convertLead.fulfilled, (state, action) => {
        upsertLead(state, action.payload.lead);
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.list = state.list.filter((l) => l.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(fetchLeadActivities.pending, (state) => {
        state.activitiesLoading = true;
      })
      .addCase(fetchLeadActivities.fulfilled, (state, action) => {
        state.activitiesLoading = false;
        state.activities = action.payload.activities;
      })
      .addCase(fetchLeadActivities.rejected, (state) => {
        state.activitiesLoading = false;
      })
      .addCase(addLeadActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload.activity);
      })
      .addCase(fetchUpcomingFollowups.pending, (state) => {
        state.followupsLoading = true;
      })
      .addCase(fetchUpcomingFollowups.fulfilled, (state, action) => {
        state.followupsLoading = false;
        state.upcomingFollowups = action.payload.followups;
      })
      .addCase(fetchUpcomingFollowups.rejected, (state) => {
        state.followupsLoading = false;
      })
      .addCase(createFollowup.fulfilled, (state, action) => {
        state.upcomingFollowups.unshift(action.payload.followup);
      })
      .addCase(updateFollowup.fulfilled, (state, action) => {
        const idx = state.upcomingFollowups.findIndex(
          (f) => f.id === action.payload.followup.id,
        );
        if (idx !== -1) state.upcomingFollowups[idx] = action.payload.followup;
      })
      .addCase(deleteFollowup.fulfilled, (state, action) => {
        state.upcomingFollowups = state.upcomingFollowups.filter(
          (f) => f.id !== action.payload,
        );
      });
  },
});

export const { optimisticallySetLeadStage } = leadsSlice.actions;
export default leadsSlice.reducer;
