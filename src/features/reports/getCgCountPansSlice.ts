import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface CgCountRecord {
  id?: string;
  clientId: string;
  portfolioName: string;
  compromiseIncidentId: string;
  count: number;
  updatedOn: string;
  updatedBy: string;
  ruleName: string;
}

interface CgCountState {
  records: CgCountRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: CgCountState = {
  records: [],
  loading: false,
  error: null,
};

const normalizeRecords = (data?: CgCountRecord[]) =>
  (data ?? []).map((row, index) => ({
    ...row,
    id: row.id ?? `${row.compromiseIncidentId || 'cg'}-${index + 1}`,
  }));

export const fetchCgCountPans = createAsyncThunk(
  'reports/fetchCgCountPans',
  async (params: { compromiseIncidentId: string }) => {
    const response = await apiClient.post<{
      code?: string;
      message?: string;
      responseList?: CgCountRecord[];
    }>(
      '/rules/v1/getCompromiseIdDetails',
      params
    );
    return response.responseList ?? [];
  }
);

const getCgCountPansSlice = createSlice({
  name: 'getCgCountPans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCgCountPans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCgCountPans.fulfilled, (state, action) => {
        state.loading = false;
        state.records = normalizeRecords(action.payload);
      })
      .addCase(fetchCgCountPans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load CG count and PANs';
      });
  },
});

export default getCgCountPansSlice.reducer;
