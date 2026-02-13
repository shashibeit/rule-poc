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

export const fetchUniqueUserLoginAllData = createAsyncThunk(
  'reports/fetchUniqueUserLoginAllData',
  async () => {
    const response = await apiClient.post<{
      code: string;
      message: string;
      responseList: UniqueUserLoginRecord[];
      total: number;
    }>('/rules/v1/userLoginCountReport', {});
    return {
      data: response.responseList,
      total: response.total || response.responseList.length,
    };
  }
);

export const fetchUniqueUserLoginSearchData = createAsyncThunk(
  'reports/fetchUniqueUserLoginSearchData',
  async (params: { clientId?: string; fiShortName?: string }) => {
    const response = await apiClient.post<{
      code: string;
      message: string;
      responseList: UniqueUserLoginRecord[];
      total: number;
    }>('/rules/v1/userLoginCountReport', params);
    return {
      data: response.responseList,
      total: response.total || response.responseList.length,
    };
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
      .addCase(fetchUniqueUserLoginAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniqueUserLoginAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUniqueUserLoginAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load unique user login report';
      })
      .addCase(fetchUniqueUserLoginSearchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniqueUserLoginSearchData.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUniqueUserLoginSearchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load unique user login report';
      });
  },
});

export const { setUniqueUserLoginPagination } = uniqueUserLoginSlice.actions;
export default uniqueUserLoginSlice.reducer;
