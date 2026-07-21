import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import membersReducer from "./slices/members.slice";
import plansReducer from "./slices/plans.slice";
import membershipsReducer from "./slices/memberships.slice";
import attendanceReducer from "./slices/attendance.slice";
import staffReducer from "./slices/staff.slice";
import classesReducer from "./slices/classes.slice";
import bookingsReducer from "./slices/bookings.slice";
import leadsReducer from "./slices/leads.slice";
import analyticsReducer from "./slices/analytics.slice";
import billingReducer from "./slices/billing.slice";
import adminAnalyticsReducer from "./slices/adminAnalytics.slice";
import subscriptionReducer from "./slices/subscription.slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      subscription: subscriptionReducer,
      members: membersReducer,
      plans: plansReducer,
      memberships: membershipsReducer,
      attendance: attendanceReducer,
      staff: staffReducer,
      classes: classesReducer,
      bookings: bookingsReducer,
      leads: leadsReducer,
      analytics: analyticsReducer,
      billing: billingReducer,
      adminAnalytics: adminAnalyticsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
