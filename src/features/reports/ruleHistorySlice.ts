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
    // Format dates to "1-NOV-2025" format
    const formatDate = (dateString: string | undefined) => {
      if (!dateString) return undefined;
      const date = new Date(dateString);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const payload = {
      ruleFromDate: formatDate(params.startDate),
      ruleDateTo: formatDate(params.endDate),
      pageNum: params.page,
      pageSize: params.pageSize,
      counter: 0, // Default counter value
      ruleName: params.ruleName || '',
      ruleTime: params.runWindow || '',
    };

    const response = await apiClient.post<{
      code: string;
      message: string;
      ruleHistoryList: RuleHistoryRecord[];
      totalRecords?: number; // Make optional since we'll calculate from data
    }>('/rules/v1/ruleHistoryList', payload);
    
    return {
      data: response.ruleHistoryList || [],
      total: response.ruleHistoryList?.length || 0, // Calculate from data, not API total
    };
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
        state.records = action.payload.data || [];
        state.total = action.payload.data?.length || 0;
      })
      .addCase(fetchRuleHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load rule history';
      });
  },
});

export const { setRuleHistoryPagination } = ruleHistorySlice.actions;
export default ruleHistorySlice.reducer;
