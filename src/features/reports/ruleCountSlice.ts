import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginationState, RuleCountRecord } from '@/types';
import { apiClient } from '@/api/client';

interface RuleCountState {
  allData: RuleCountRecord[];
  records: RuleCountRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: RuleCountState = {
  allData: [],
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

export const fetchRuleCountAllData = createAsyncThunk(
  'reports/fetchRuleCountAllData',
  async (params: { ruleDateTo: string; ruleTime: string }) => {
    const response = await apiClient.post<{
      code: string;
      message: string;
      ruleCountList: Array<{
        ruleCategory: string;
        ruleSet: string;
        ruleAction: string;
        ruleCount: number;
      }>;
    }>('/rules/v1/getRuleCount', {
      ruleDateTo: params.ruleDateTo,
      ruleTime: params.ruleTime,
    });
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
    setRuleCountRecords: (state, action: PayloadAction<RuleCountRecord[]>) => {
      state.records = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRuleCountAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRuleCountAllData.fulfilled, (state, action) => {
        state.loading = false;
        // Transform the API response to match our interface
        const ruleCountList = action.payload.ruleCountList || [];
        const transformedData = ruleCountList.map((item, index) => ({
          id: `rule-count-${index + 1}`,
          ruleCategoryName: item.ruleCategory,
          ruleSetName: item.ruleSet,
          action: item.ruleAction,
          ruleCount: item.ruleCount,
        }));
        state.allData = transformedData;
        state.records = transformedData;
        state.total = transformedData.length;
      })
      .addCase(fetchRuleCountAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load rule count';
      });
  },
});

export const { setRuleCountPagination, setRuleCountRecords } = ruleCountSlice.actions;
export default ruleCountSlice.reducer;
