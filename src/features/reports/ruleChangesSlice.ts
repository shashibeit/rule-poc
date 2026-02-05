import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginationState, RuleChangeRecord } from '@/types';
import { apiClient } from '@/api/client';

interface RuleChangesState {
  records: RuleChangeRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: RuleChangesState = {
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

export const fetchRuleChanges = createAsyncThunk(
  'reports/fetchRuleChanges',
  async (params: { page: number; pageSize: number; search: string }) => {
    const response = await apiClient.get<{
      data: RuleChangeRecord[];
      total: number;
    }>('/reports/rule-changes', params);
    return response;
  }
);

const ruleChangesSlice = createSlice({
  name: 'ruleChanges',
  initialState,
  reducers: {
    setRuleChangesPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRuleChanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRuleChanges.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchRuleChanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load rule changes';
      });
  },
});

export const { setRuleChangesPagination } = ruleChangesSlice.actions;
export default ruleChangesSlice.reducer;
