import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface PanSearchRecord {
  id?: string;
  pan: string;
  remarks: string;
}

interface PanSearchState {
  records: PanSearchRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: PanSearchState = {
  records: [],
  loading: false,
  error: null,
};

const normalizeRecords = (data?: PanSearchRecord[]) =>
  (data ?? []).map((row, index) => ({
    ...row,
    id: row.id ?? `${row.pan || 'pan'}-${index + 1}`,
  }));

export const fetchCompromisedIdByPan = createAsyncThunk(
  'reports/fetchCompromisedIdByPan',
  async (pans: string[]) => {
    const response = await apiClient.post<{
      code?: string;
      message?: string;
      responseList?: PanSearchRecord[];
    }>(
      '/rules/v1/compromisedIdByPan',
      pans
    );
    return response.responseList ?? [];
  }
);

const searchCgUsingPanSlice = createSlice({
  name: 'searchCgUsingPan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompromisedIdByPan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompromisedIdByPan.fulfilled, (state, action) => {
        state.loading = false;
        state.records = normalizeRecords(action.payload);
      })
      .addCase(fetchCompromisedIdByPan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load PAN search results';
      });
  },
});

export default searchCgUsingPanSlice.reducer;
