import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface NotBoardedFiRecord {
  id?: string;
  clientId: string;
  portfolioName: string;
  fiName: string;
  dpsDescription: string;
}

type NotBoardedFiRecordInput = Partial<NotBoardedFiRecord>;

export interface FiOnboardingEmailPayload {
  acro: null;
  advice: null;
  ccmFlag: null;
  cmLastUpdatedDate: null;
  cmLastUpdatedUid: null;
  ccmServiceFlag: null;
  ccsFlag: null;
  ccsLastUpdatedDate: null;
  ccsLastUpdatedUid: null;
  chsFlag: null;
  chsLastUpdatedDate: null;
  chsLastUpdatedUid: null;
  clientId: string;
  cpmTenantId: null;
  dpsCode: string;
  dpsComment: null;
  dpsDescription: string;
  dpsFlag: null;
  dpsLastUpdatedDate: null;
  dpsLastUpdatedUid: null;
  falcom: null;
  fiChecked: true;
  filastUpdatedDate: null;
  filastUpdatedUid: null;
  FiName: string;
  portfolioName: string;
  rcdDelValue: null;
  stopPayFlag: null;
  stopPayLastUpdatedDate: null;
  stopPayLastUpdatedUid: null;
  updateTimestamp: null;
  updateUid: null;
}

interface FiBoardingState {
  records: NotBoardedFiRecord[];
  loading: boolean;
  error: string | null;
  sending: boolean;
  sendSuccessMessage: string | null;
  sendErrorMessage: string | null;
}

const initialState: FiBoardingState = {
  records: [],
  loading: false,
  error: null,
  sending: false,
  sendSuccessMessage: null,
  sendErrorMessage: null,
};

const normalizeRecords = (data?: NotBoardedFiRecordInput[]) =>
  (data ?? []).map((row, index) => ({
    id: row.id ?? `${row.clientId || 'fi'}-${index + 1}`,
    clientId: row.clientId ?? '',
    portfolioName: row.portfolioName ?? '',
    fiName: row.fiName ?? '',
    dpsDescription: row.dpsDescription ?? '',
  }));

export const fetchNotBoardedFiDetails = createAsyncThunk(
  'reports/fetchNotBoardedFiDetails',
  async () => {
    const response = await apiClient.get<{
      code?: string;
      message?: string;
      responseList?: NotBoardedFiRecordInput[];
    }>('/rules/v1/getNotBoardedFiDetails');

    return response.responseList ?? [];
  }
);

export const sendFiOnboardingEmail = createAsyncThunk<
  string,
  FiOnboardingEmailPayload[],
  { rejectValue: string }
>('reports/sendFiOnboardingEmail', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{
      code?: string;
      message?: string;
      data?: { message?: string };
    }>('/rules/v1/sendFIOnboardingEmail', payload);

    const code = response.code ?? '';

    if (code.toUpperCase() === 'SUCCESS') {
      return 'FI Onboarding Email sent SUccessfully ...';
    }

    if (code === 'Email Error') {
      return rejectWithValue(response.data?.message || response.message || 'Email Error');
    }

    return rejectWithValue('error while processing FI Onboarding');
  } catch {
    return rejectWithValue('error while processing FI Onboarding');
  }
});

const fiBoardingSlice = createSlice({
  name: 'fiBoarding',
  initialState,
  reducers: {
    clearFiBoardingMessages: (state) => {
      state.sendSuccessMessage = null;
      state.sendErrorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotBoardedFiDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotBoardedFiDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.records = normalizeRecords(action.payload);
      })
      .addCase(fetchNotBoardedFiDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load FI Boarding details';
      })
      .addCase(sendFiOnboardingEmail.pending, (state) => {
        state.sending = true;
        state.sendSuccessMessage = null;
        state.sendErrorMessage = null;
      })
      .addCase(sendFiOnboardingEmail.fulfilled, (state, action) => {
        state.sending = false;
        state.sendSuccessMessage = action.payload;
      })
      .addCase(sendFiOnboardingEmail.rejected, (state, action) => {
        state.sending = false;
        state.sendErrorMessage = action.payload || 'error while processing FI Onboarding';
      });
  },
});

export const { clearFiBoardingMessages } = fiBoardingSlice.actions;
export default fiBoardingSlice.reducer;
