import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface AddFiRequestPayload {
  ACRO: string;
  CCM_FLAG: string;
  CCM_SERVICE_FLAG?: string;
  CCM_TENANT_ID?: string;
  CCS_FLAG: string;
  CHS_FLAG: string;
  ClientID: number;
  DPS_COMMENTS: string;
  DPS_FLAG: string;
  'FI Name': string;
  'Portfolio Name': string;
  stopPayFlag: string;
}

interface AddFiApiResponse {
  code: string;
  message: string;
  responseList: unknown[];
}

interface AddFiState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AddFiState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const submitAddFiDetails = createAsyncThunk<
  { code: string; message: string },
  AddFiRequestPayload,
  { rejectValue: string }
>('addFi/submitAddFiDetails', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<AddFiApiResponse>('/rules/v1/addFiDetails', payload);

    if (response.code === '200' || response.code.toUpperCase() === 'SUCCESS') {
      return {
        code: response.code,
        message: response.message || 'FI details added successfully',
      };
    }

    return rejectWithValue(response.message || response.code || 'Unable to add FI details');
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to add FI details');
  }
});

const addFiSlice = createSlice({
  name: 'addFi',
  initialState,
  reducers: {
    clearAddFiMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAddFiDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitAddFiDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitAddFiDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Unable to add FI details';
      });
  },
});

export const { clearAddFiMessage } = addFiSlice.actions;
export default addFiSlice.reducer;
