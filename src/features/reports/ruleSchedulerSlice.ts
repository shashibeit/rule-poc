import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginationState, RuleSchedulerRecord } from '@/types';
import { apiClient } from '@/api/client';

interface RuleSchedulerState {
  records: RuleSchedulerRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: RuleSchedulerState = {
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

export const fetchRuleScheduler = createAsyncThunk(
  'reports/fetchRuleScheduler',
  async (params: {
    page: number;
    pageSize: number;
    ruleName?: string;
    runWindow?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get<{
      data: RuleSchedulerRecord[];
      total: number;
    }>('/reports/rule-scheduler', params);
    return response;
  }
);

const ruleSchedulerSlice = createSlice({
  name: 'ruleScheduler',
  initialState,
  reducers: {
    setRuleSchedulerPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRuleScheduler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRuleScheduler.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchRuleScheduler.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load rule scheduler history';
      });
  },
});

export const { setRuleSchedulerPagination } = ruleSchedulerSlice.actions;
export default ruleSchedulerSlice.reducer;
