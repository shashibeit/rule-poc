import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginationState, RuleCountRecord } from '@/types';
import { apiClient } from '@/api/client';

interface RuleCountState {
  records: RuleCountRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: RuleCountState = {
  records: [],
  total: 0,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    pageSize: 10,
    searchText: '',
  },
};

export const fetchRuleCount = createAsyncThunk(
  'reports/fetchRuleCount',
  async (params: { page: number; pageSize: number; runWindow: string; date: string }) => {
    const response = await apiClient.get<{
      data: RuleCountRecord[];
      total: number;
    }>('/reports/rule-count', params);
    return response;
  }
);

const ruleCountSlice = createSlice({
  name: 'ruleCount',
  initialState,
  reducers: {
    setRuleCountPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRuleCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRuleCount.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchRuleCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load rule count';
      });
  },
});

export const { setRuleCountPagination } = ruleCountSlice.actions;
export default ruleCountSlice.reducer;
