import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet } from "@/lib/api/client";
import {
  AttendanceAnalytics,
  ClassAnalytics,
  LeadAnalytics,
  MemberAnalytics,
  OverviewKpis,
  RevenueAnalytics,
} from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

interface AnalyticsState {
  overview: OverviewKpis | null;
  overviewLoading: boolean;
  overviewError: string | null;

  members: MemberAnalytics | null;
  membersLoading: boolean;
  membersError: string | null;

  revenue: RevenueAnalytics | null;
  revenueLoading: boolean;
  revenueError: string | null;

  attendance: AttendanceAnalytics | null;
  attendanceLoading: boolean;
  attendanceError: string | null;

  leads: LeadAnalytics | null;
  leadsLoading: boolean;
  leadsError: string | null;

  classes: ClassAnalytics | null;
  classesLoading: boolean;
  classesError: string | null;
}

const initialState: AnalyticsState = {
  overview: null,
  overviewLoading: false,
  overviewError: null,
  members: null,
  membersLoading: false,
  membersError: null,
  revenue: null,
  revenueLoading: false,
  revenueError: null,
  attendance: null,
  attendanceLoading: false,
  attendanceError: null,
  leads: null,
  leadsLoading: false,
  leadsError: null,
  classes: null,
  classesLoading: false,
  classesError: null,
};

export const fetchOverview = createAsyncThunk<
  OverviewKpis,
  void,
  { rejectValue: string }
>("analytics/overview", async (_, { rejectWithValue }) => {
  try {
    return await apiGet<OverviewKpis>("/analytics/overview");
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load overview."));
  }
});

export const fetchMemberAnalytics = createAsyncThunk<
  MemberAnalytics,
  { months?: number } | undefined,
  { rejectValue: string }
>("analytics/members", async (params = { months: 6 }, { rejectWithValue }) => {
  try {
    return await apiGet<MemberAnalytics>("/analytics/members", { params });
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load member analytics."));
  }
});

export const fetchRevenueAnalytics = createAsyncThunk<
  RevenueAnalytics,
  { months?: number } | undefined,
  { rejectValue: string }
>(
  "analytics/revenue",
  async (params = { months: 12 }, { rejectWithValue }) => {
    try {
      return await apiGet<RevenueAnalytics>("/analytics/revenue", { params });
    } catch (err) {
      return rejectWithValue(
        getErrorMessage(err, "Unable to load revenue analytics."),
      );
    }
  },
);

export const fetchAttendanceAnalytics = createAsyncThunk<
  AttendanceAnalytics,
  { days?: number; inactiveDays?: number } | undefined,
  { rejectValue: string }
>(
  "analytics/attendance",
  async (params = { days: 30, inactiveDays: 14 }, { rejectWithValue }) => {
    try {
      return await apiGet<AttendanceAnalytics>("/analytics/attendance", {
        params,
      });
    } catch (err) {
      return rejectWithValue(
        getErrorMessage(err, "Unable to load attendance analytics."),
      );
    }
  },
);

export const fetchLeadAnalytics = createAsyncThunk<
  LeadAnalytics,
  { months?: number } | undefined,
  { rejectValue: string }
>("analytics/leads", async (params = { months: 6 }, { rejectWithValue }) => {
  try {
    return await apiGet<LeadAnalytics>("/analytics/leads", { params });
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to load lead analytics."),
    );
  }
});

export const fetchClassAnalytics = createAsyncThunk<
  ClassAnalytics,
  { days?: number } | undefined,
  { rejectValue: string }
>("analytics/classes", async (params = { days: 30 }, { rejectWithValue }) => {
  try {
    return await apiGet<ClassAnalytics>("/analytics/classes", { params });
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to load class analytics."),
    );
  }
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.overviewLoading = true;
        state.overviewError = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.overviewLoading = false;
        state.overviewError = action.payload ?? "Unable to load overview.";
      })
      .addCase(fetchMemberAnalytics.pending, (state) => {
        state.membersLoading = true;
        state.membersError = null;
      })
      .addCase(fetchMemberAnalytics.fulfilled, (state, action) => {
        state.membersLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchMemberAnalytics.rejected, (state, action) => {
        state.membersLoading = false;
        state.membersError = action.payload ?? "Unable to load member analytics.";
      })
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.revenueLoading = true;
        state.revenueError = null;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.revenueLoading = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.revenueLoading = false;
        state.revenueError =
          action.payload ?? "Unable to load revenue analytics.";
      })
      .addCase(fetchAttendanceAnalytics.pending, (state) => {
        state.attendanceLoading = true;
        state.attendanceError = null;
      })
      .addCase(fetchAttendanceAnalytics.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendanceAnalytics.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceError =
          action.payload ?? "Unable to load attendance analytics.";
      })
      .addCase(fetchLeadAnalytics.pending, (state) => {
        state.leadsLoading = true;
        state.leadsError = null;
      })
      .addCase(fetchLeadAnalytics.fulfilled, (state, action) => {
        state.leadsLoading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeadAnalytics.rejected, (state, action) => {
        state.leadsLoading = false;
        state.leadsError = action.payload ?? "Unable to load lead analytics.";
      })
      .addCase(fetchClassAnalytics.pending, (state) => {
        state.classesLoading = true;
        state.classesError = null;
      })
      .addCase(fetchClassAnalytics.fulfilled, (state, action) => {
        state.classesLoading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClassAnalytics.rejected, (state, action) => {
        state.classesLoading = false;
        state.classesError =
          action.payload ?? "Unable to load class analytics.";
      });
  },
});

export default analyticsSlice.reducer;
