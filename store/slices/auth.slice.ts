import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "@/lib/api/client";
import { AuthLoginResponse, AuthUser } from "@/lib/api/domain-types";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth/tokens";
import { getErrorMessage } from "@/lib/api/error";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;
  pendingRegisterEmail: string | null;
  pendingResetEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
  error: null,
  pendingRegisterEmail: null,
  pendingResetEmail: null,
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  gymName: string;
  ownerName: string;
  ownerEmail: string;
  password: string;
  confirmPassword: string;
  ownerPhone?: string;
}

export const loginThunk = createAsyncThunk<
  AuthLoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const data = await apiPost<AuthLoginResponse>("/auth/login", payload);
    if (data.accessToken) setAccessToken(data.accessToken);
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to sign in."));
  }
});

export const adminLoginThunk = createAsyncThunk<
  { admin: AuthUser; accessToken: string },
  LoginPayload,
  { rejectValue: string }
>("auth/adminLogin", async (payload, { rejectWithValue }) => {
  try {
    const data = await apiPost<{ admin: AuthUser; accessToken: string }>(
      "/admin/login",
      payload,
    );
    if (data.accessToken) setAccessToken(data.accessToken);
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Admin login failed."));
  }
});

export const verifyAdminOtpThunk = createAsyncThunk<
  { admin: AuthUser; accessToken: string },
  { email: string; otp: string },
  { rejectValue: string }
>("auth/verifyAdminOtp", async (payload, { rejectWithValue }) => {
  try {
    const data = await apiPost<{ admin: AuthUser; accessToken: string }>(
      "/admin/verify-otp",
      payload,
    );
    if (data.accessToken) setAccessToken(data.accessToken);
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "OTP verification failed."));
  }
});

export const registerThunk = createAsyncThunk<
  { email: string },
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    await apiPost<unknown>("/auth/register", payload);
    return { email: payload.ownerEmail };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to register gym."));
  }
});

export const verifyEmailThunk = createAsyncThunk<
  { email: string },
  { email: string; otp: string },
  { rejectValue: string }
>("auth/verifyEmail", async (payload, { rejectWithValue }) => {
  try {
    await apiPost<unknown>("/auth/verify-email", payload);
    return { email: payload.email };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "OTP verification failed."));
  }
});

export const resendAdminOtpThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/resendAdminOtp", async (payload, { rejectWithValue }) => {
  try {
    await apiPost<unknown>("/admin/resend-otp", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to resend OTP."));
  }
});

export const resendOtpThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/resendOtp", async (payload, { rejectWithValue }) => {
  try {
    await apiPost<unknown>("/auth/resend-otp", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to resend OTP."));
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  { email: string },
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    await apiPost<unknown>("/auth/forgot-password", payload);
    return { email: payload.email };
  } catch (err) {
    return rejectWithValue(
      getErrorMessage(err, "Unable to send reset email."),
    );
  }
});

export const resetPasswordThunk = createAsyncThunk<
  void,
  { email: string; otp: string; newPassword: string },
  { rejectValue: string }
>("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    await apiPost<unknown>("/auth/reset-password", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to reset password."));
  }
});

export const logoutThunk = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    try {
      await apiPost<unknown>("/auth/logout");
    } catch {
      // ignore — always clear local state
    } finally {
      clearAccessToken();
    }
  },
);

export const fetchProfile = createAsyncThunk<
  { user: AuthUser } | null,
  void,
  { rejectValue: string }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    // /users/me endpoint doesn't exist yet
    // Return null to skip profile fetch for now
    return null;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to fetch profile."));
  }
});

export const fetchSubscription = createAsyncThunk<
  { subscription: any },
  void,
  { rejectValue: string }
>("auth/fetchSubscription", async (_, { rejectWithValue }) => {
  try {
    return await apiGet<{ subscription: any }>("/subscription/me");
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to fetch subscription."));
  }
});

export const bootstrapAuth = createAsyncThunk<
  { accessToken: string } | null
>("auth/bootstrap", async (_, { dispatch }) => {
  const token = getAccessToken();
  if (!token) return null;
  dispatch(fetchProfile());
  dispatch(fetchSubscription());
  return { accessToken: token };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "unauthenticated";
      clearAccessToken();
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.accessToken = action.payload.accessToken;
        const user = action.payload.user;
        if (user) {
          state.user = {
            ...user,
            gymName: user.gymName || user.gym_name,
            avatarUrl: user.avatarUrl || user.avatar_url,
          };
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload ?? "Sign-in failed.";
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.accessToken = action.payload.accessToken;
        const user = action.payload.admin;
        if (user) {
          state.user = {
            ...user,
            gymName: user.gymName || user.gym_name,
            avatarUrl: user.avatarUrl || user.avatar_url,
          };
        }
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload ?? "Admin login failed.";
      })
      .addCase(verifyAdminOtpThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyAdminOtpThunk.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.accessToken = action.payload.accessToken;
        const user = action.payload.admin;
        if (user) {
          state.user = {
            ...user,
            gymName: user.gymName || user.gym_name,
            avatarUrl: user.avatarUrl || user.avatar_url,
          };
        }
      })
      .addCase(verifyAdminOtpThunk.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload ?? "OTP verification failed.";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.pendingRegisterEmail = action.payload.email;
      })
      .addCase(verifyEmailThunk.fulfilled, (state) => {
        state.pendingRegisterEmail = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.pendingResetEmail = action.payload.email;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.pendingResetEmail = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = "unauthenticated";
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        if (action.payload?.accessToken) {
          state.accessToken = action.payload.accessToken;
          state.status = "authenticated";
        } else {
          state.status = "unauthenticated";
        }
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        const user = action.payload.user || (action.payload as any);
        if (user) {
          state.user = {
            ...user,
            gymName: user.gymName || user.gym_name,
            avatarUrl: user.avatarUrl || user.avatar_url,
          };
        }
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
        clearAccessToken();
      });
  },
});

export const { sessionExpired, setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
