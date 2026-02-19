import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface FiBoardingStatusRecord {
  id?: string;
  clientId: string;
  serviceCode: string;
  fiName: string;
  onFiDetails: string;
  onOrgClientDetails: string;
  status: string;
  details: string;
}

type FiBoardingStatusRecordInput = Partial<FiBoardingStatusRecord>;

interface FiBoardingStatusState {
  records: FiBoardingStatusRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: FiBoardingStatusState = {
  records: [],
  loading: false,
  error: null,
};

const normalizeRecords = (data?: FiBoardingStatusRecordInput[]) =>
  (data ?? []).map((row, index) => ({
    id: row.id ?? `${row.clientId || 'fi'}-${index + 1}`,
    clientId: row.clientId ?? '',
    serviceCode: row.serviceCode ?? '',
    fiName: row.fiName ?? '',
    onFiDetails: row.onFiDetails ?? '',
    onOrgClientDetails: row.onOrgClientDetails ?? '',
    status: row.status ?? '',
    details: row.details ?? '',
  }));

export const fetchFiBoardingStatus = createAsyncThunk(
  'reports/fetchFiBoardingStatus',
  async () => {
    const response = await apiClient.get<{
      code?: string;
      message?: string;
      responseList?: FiBoardingStatusRecordInput[];
    }>('/rules/v1/getFiCompareResult');

    return response.responseList ?? [];
  }
);

const fiBoardingStatusSlice = createSlice({
  name: 'fiBoardingStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiBoardingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiBoardingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.records = normalizeRecords(action.payload);
      })
      .addCase(fetchFiBoardingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load FI Boarding Status';
      });
  },
});

export default fiBoardingStatusSlice.reducer;
