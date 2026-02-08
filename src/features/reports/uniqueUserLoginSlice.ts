import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginationState, UniqueUserLoginRecord } from '@/types';
import { apiClient } from '@/api/client';

interface UniqueUserLoginState {
  records: UniqueUserLoginRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: UniqueUserLoginState = {
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

export const fetchUniqueUserLoginAll = createAsyncThunk(
  'reports/fetchUniqueUserLoginAll',
  async (params: { page: number; pageSize: number }) => {
    const response = await apiClient.get<{
      data: UniqueUserLoginRecord[];
      total: number;
    }>('/reports/unique-user-logins', params);
    return response;
  }
);

export const fetchUniqueUserLoginSearch = createAsyncThunk(
  'reports/fetchUniqueUserLoginSearch',
  async (params: { page: number; pageSize: number; clientId?: string; portfolioName?: string }) => {
    const response = await apiClient.post<{
      data: UniqueUserLoginRecord[];
      total: number;
    }>('/reports/unique-user-logins/search', params);
    return response;
  }
);

const uniqueUserLoginSlice = createSlice({
  name: 'uniqueUserLogin',
  initialState,
  reducers: {
    setUniqueUserLoginPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniqueUserLoginAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniqueUserLoginAll.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUniqueUserLoginAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load unique user login report';
      })
      .addCase(fetchUniqueUserLoginSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniqueUserLoginSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUniqueUserLoginSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load unique user login report';
      });
  },
});

export const { setUniqueUserLoginPagination } = uniqueUserLoginSlice.actions;
export default uniqueUserLoginSlice.reducer;
