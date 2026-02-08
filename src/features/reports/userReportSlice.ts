import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginationState, UserReportRecord } from '@/types';
import { apiClient } from '@/api/client';

interface UserReportState {
  records: UserReportRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: UserReportState = {
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

export const fetchUserReportAll = createAsyncThunk(
  'reports/fetchUserReportAll',
  async (params: { page: number; pageSize: number }) => {
    const response = await apiClient.get<{
      data: UserReportRecord[];
      total: number;
    }>('/reports/user-report', params);
    return response;
  }
);

export const fetchUserReportSearch = createAsyncThunk(
  'reports/fetchUserReportSearch',
  async (params: { page: number; pageSize: number; clientId?: string; portfolioName?: string }) => {
    const response = await apiClient.post<{
      data: UserReportRecord[];
      total: number;
    }>('/reports/user-report/search', params);
    return response;
  }
);

const userReportSlice = createSlice({
  name: 'userReport',
  initialState,
  reducers: {
    setReportPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReportAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReportAll.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUserReportAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load user report';
      })
      .addCase(fetchUserReportSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReportSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUserReportSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load user report';
      });
  },
});

export const { setReportPagination } = userReportSlice.actions;
export default userReportSlice.reducer;
