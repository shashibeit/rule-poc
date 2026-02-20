import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface ModifyDcSubBrandRecord {
  id?: string;
  clientId: string;
  fiName: string;
  portfolioName: string;
  brandName: string;
  bin: string;
  urlAddress: string;
  emailAddress: string;
}

type ModifyDcSubBrandRecordInput = Partial<ModifyDcSubBrandRecord> & {
  oldBin?: string;
};

export interface UpdateBrandingDetailsPayload {
  bin: string;
  brandName: string;
  clientId: string;
  emailAddress: string;
  fiName: string;
  urlAddress: string;
}

interface ModifyDcSubBrandState {
  records: ModifyDcSubBrandRecord[];
  loading: boolean;
  error: string | null;
  saveLoading: boolean;
  saveSuccessMessage: string | null;
  saveErrorMessage: string | null;
  saveErrorCode: string | null;
}

const initialState: ModifyDcSubBrandState = {
  records: [],
  loading: false,
  error: null,
  saveLoading: false,
  saveSuccessMessage: null,
  saveErrorMessage: null,
  saveErrorCode: null,
};

const normalizeRecords = (data?: ModifyDcSubBrandRecordInput[]) =>
  (data ?? []).map((row, index) => ({
    id: row.id ?? `${row.clientId || 'dc'}-${index + 1}`,
    clientId: row.clientId ?? '',
    fiName: row.fiName ?? '',
    portfolioName: row.portfolioName ?? '',
    brandName: row.brandName ?? '',
    bin: row.bin ?? '',
    urlAddress: row.urlAddress ?? '',
    emailAddress: row.emailAddress ?? '',
  }));

export const fetchModifyDcSubBrand = createAsyncThunk(
  'reports/fetchModifyDcSubBrand',
  async (payload: { clientId: string }) => {
    const response = await apiClient.post<{
      code?: string;
      message?: string;
      responseList?: ModifyDcSubBrandRecordInput[];
    }>('/rules/v1/searchFiExtDetails', payload);

    return response.responseList ?? [];
  }
);

export const updateBrandingDetails = createAsyncThunk<
  { code: string; message: string },
  UpdateBrandingDetailsPayload,
  { rejectValue: { code: string; message: string } }
>('reports/updateBrandingDetails', async (payload, { rejectWithValue }) => {
  const response = await apiClient.post<{
    code?: string;
    message?: string;
  }>('/rules/v1/updateBrandingDetails', payload);

  const code = response.code ?? 'UNKNOWN_ERROR';
  const message = response.message ?? 'Unable to save branding details';

  if (code.toUpperCase() === 'SUCCESS') {
    return { code, message };
  }

  return rejectWithValue({ code, message });
});

const modifyDcSubBrandSlice = createSlice({
  name: 'modifyDcSubBrand',
  initialState,
  reducers: {
    clearModifyDcSubBrand: (state) => {
      state.records = [];
      state.error = null;
      state.saveSuccessMessage = null;
      state.saveErrorMessage = null;
      state.saveErrorCode = null;
    },
    clearModifyDcSubBrandSaveStatus: (state) => {
      state.saveSuccessMessage = null;
      state.saveErrorMessage = null;
      state.saveErrorCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModifyDcSubBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModifyDcSubBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.records = normalizeRecords(action.payload);
      })
      .addCase(fetchModifyDcSubBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load DC Sub-Brand details';
      })
      .addCase(updateBrandingDetails.pending, (state) => {
        state.saveLoading = true;
        state.saveSuccessMessage = null;
        state.saveErrorMessage = null;
        state.saveErrorCode = null;
      })
      .addCase(updateBrandingDetails.fulfilled, (state) => {
        state.saveLoading = false;
        state.saveSuccessMessage = 'Detailes Saved Successfully';
      })
      .addCase(updateBrandingDetails.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveErrorCode = action.payload?.code ?? null;
        state.saveErrorMessage =
          action.payload?.code === 'INVALID_DATA_ERROR'
            ? 'Sub Brand name Cannot be same as sub brand with 0 bin'
            : action.payload?.message || 'Unable to save branding details';
      });
  },
});

export const { clearModifyDcSubBrand, clearModifyDcSubBrandSaveStatus } = modifyDcSubBrandSlice.actions;
export default modifyDcSubBrandSlice.reducer;
