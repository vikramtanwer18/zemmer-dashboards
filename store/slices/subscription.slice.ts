import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSubscription } from "./auth.slice";

export interface Subscription {
  id: string;
  status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED";
  effectiveStatus: string;
  tier: string;
  trialStartedAt?: string;
  trialEndsAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  daysRemaining?: number;
  isLocked?: boolean;
  showUpgradeBanner?: boolean;
  cancelAtPeriodEnd?: boolean;
  cancelledAt?: string;
  nextBillingAt?: string;
  saasPlan?: {
    id: string;
    key: string;
    name: string;
    monthlyPricePaise: number;
    annualPricePaise: number;
    maxMembers: number;
    maxStaffUsers: number;
    maxClassesPerMonth: number;
    featureFlags?: Record<string, boolean>;
    isActive: boolean;
  };
}

interface SubscriptionState {
  data: Subscription | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  data: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscription(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.subscription;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch subscription";
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
