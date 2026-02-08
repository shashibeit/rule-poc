import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginationState, RuleHistoryRecord } from '@/types';
import { apiClient } from '@/api/client';

interface RuleHistoryState {
  records: RuleHistoryRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: RuleHistoryState = {
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

export const fetchRuleHistory = createAsyncThunk(
  'reports/fetchRuleHistory',
  async (params: {
    page: number;
    pageSize: number;
    ruleName?: string;
    runWindow?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get<{
      data: RuleHistoryRecord[];
      total: number;
    }>('/reports/rule-history', params);
    return response;
  }
);

const ruleHistorySlice = createSlice({
  name: 'ruleHistory',
  initialState,
  reducers: {
    setRuleHistoryPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRuleHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRuleHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchRuleHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load rule history';
      });
  },
});

export const { setRuleHistoryPagination } = ruleHistorySlice.actions;
export default ruleHistorySlice.reducer;
