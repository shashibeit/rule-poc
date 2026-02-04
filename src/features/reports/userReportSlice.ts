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

export const fetchUserReport = createAsyncThunk(
  'reports/fetchUserReport',
  async (params: { page: number; pageSize: number; search: string }) => {
    const response = await apiClient.get<{
      data: UserReportRecord[];
      total: number;
    }>('/reports/user-logins', params);
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
      .addCase(fetchUserReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReport.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUserReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load user report';
      });
  },
});

export const { setReportPagination } = userReportSlice.actions;
export default userReportSlice.reducer;
