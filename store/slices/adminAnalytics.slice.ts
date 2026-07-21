import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPatch, apiDelete } from "@/lib/api/client";

interface AdminStats {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface RecentActivity {
  label: string;
  desc: string;
  time: string;
  icon: string;
  color: string;
}

interface AdminAnalyticsState {
  overview: {
    stats: AdminStats[];
    recentActivity: RecentActivity[];
  } | null;
  gyms: any[];
  selectedGym: any | null;
  earnings: {
    totalVolume: number;
    commission: number;
    recentTransactions: any[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminAnalyticsState = {
  overview: null,
  gyms: [],
  selectedGym: null,
  earnings: null,
  loading: false,
  error: null,
};

export const fetchAdminOverview = createAsyncThunk(
  "adminAnalytics/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGet<any>("/admin/overview");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch overview");
    }
  }
);

export const fetchAdminGyms = createAsyncThunk(
  "adminAnalytics/fetchGyms",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGet<any>("/admin/gyms");
      return data.gyms;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch gyms");
    }
  }
);

export const fetchAdminGymDetails = createAsyncThunk(
  "adminAnalytics/fetchGymDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await apiGet<any>(`/admin/gyms/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch gym details");
    }
  }
);

export const updateAdminGym = createAsyncThunk(
  "adminAnalytics/updateGym",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiPatch<any>(`/admin/gyms/${id}`, data);
      return response.gym;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update gym");
    }
  }
);

export const deleteAdminGym = createAsyncThunk(
  "adminAnalytics/deleteGym",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDelete<any>(`/admin/gyms/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete gym");
    }
  }
);

export const fetchAdminEarnings = createAsyncThunk(
  "adminAnalytics/fetchEarnings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGet<any>("/admin/earnings");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch earnings");
    }
  }
);

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminGyms.fulfilled, (state, action) => {
        state.gyms = action.payload;
      })
      .addCase(fetchAdminGymDetails.pending, (state) => {
        state.loading = true;
        state.selectedGym = null;
      })
      .addCase(fetchAdminGymDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGym = action.payload;
      })
      .addCase(fetchAdminGymDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminEarnings.fulfilled, (state, action) => {
        state.earnings = action.payload;
      });
  },
});

export default adminAnalyticsSlice.reducer;
