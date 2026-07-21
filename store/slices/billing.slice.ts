import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet } from "@/lib/api/client";
import { Invoice, InvoiceStatus } from "@/lib/api/domain-types";
import { getErrorMessage } from "@/lib/api/error";

export interface BillingListQuery {
  page?: number;
  limit?: number;
  status?: InvoiceStatus | "";
  member_id?: string;
  search?: string;
}

export interface BillingListResponse {
  invoices: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface BillingState {
  list: Invoice[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  listLoading: boolean;
  listError: string | null;

  current: Invoice | null;
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: BillingState = {
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
};

export const fetchInvoices = createAsyncThunk<
  BillingListResponse,
  BillingListQuery | undefined,
  { rejectValue: string }
>("billing/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    const data = await apiGet<BillingListResponse>("/billing", { params });
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load invoices."));
  }
});

export const fetchInvoiceById = createAsyncThunk<
  { invoice: Invoice },
  string,
  { rejectValue: string }
>("billing/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await apiGet<{ invoice: Invoice }>(`/billing/${id}`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to load invoice."));
  }
});

export interface CreateInvoicePayload {
  member_id: string;
  amount_paise: number;
  due_date: string;
  status?: InvoiceStatus;
  grace_days?: number;
}

export const createInvoice = createAsyncThunk<
  { invoice: Invoice },
  CreateInvoicePayload,
  { rejectValue: string }
>("billing/create", async (payload, { rejectWithValue }) => {
  try {
    const { apiPost } = await import("@/lib/api/client");
    return await apiPost<{ invoice: Invoice }>("/billing", payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to create invoice."));
  }
});

export const deleteInvoice = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("billing/delete", async (id, { rejectWithValue }) => {
  try {
    const { apiDelete } = await import("@/lib/api/client");
    await apiDelete(`/billing/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to delete invoice."));
  }
});

export const updateInvoice = createAsyncThunk<
  { invoice: Invoice },
  { id: string; patch: Partial<CreateInvoicePayload> },
  { rejectValue: string }
>("billing/update", async ({ id, patch }, { rejectWithValue }) => {
  try {
    const { apiPatch } = await import("@/lib/api/client");
    return await apiPatch<{ invoice: Invoice }>(`/billing/${id}`, patch);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Unable to update invoice."));
  }
});

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    resetCurrentInvoice(state) {
      state.current = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.invoices;
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.limit;
        state.total = action.payload.pagination.total;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload ?? "Unable to load invoices.";
      })
      .addCase(fetchInvoiceById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.invoice;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? "Unable to load invoice.";
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.list.unshift(action.payload.invoice);
        state.total += 1;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.list = state.list.filter((inv) => inv.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.list.findIndex((inv) => inv.id === action.payload.invoice.id);
        if (index !== -1) {
          state.list[index] = action.payload.invoice;
        }
        if (state.current?.id === action.payload.invoice.id) {
          state.current = action.payload.invoice;
        }
      });
  },
});

export const { resetCurrentInvoice } = billingSlice.actions;
export default billingSlice.reducer;
