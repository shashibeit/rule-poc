import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginationState, OperationHistoryRecord } from '@/types';
import { apiClient } from '@/api/client';

interface OperationHistoryState {
  records: OperationHistoryRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: OperationHistoryState = {
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

export const fetchOperationHistory = createAsyncThunk(
  'reports/fetchOperationHistory',
  async (params: { page: number; pageSize: number; operationType: string }) => {
    const response = await apiClient.get<{
      data: OperationHistoryRecord[];
      total: number;
    }>('/reports/operation-history', params);
    return response;
  }
);

const operationHistorySlice = createSlice({
  name: 'operationHistory',
  initialState,
  reducers: {
    setOperationHistoryPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchOperationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load operation history';
      });
  },
});

export const { setOperationHistoryPagination } = operationHistorySlice.actions;
export default operationHistorySlice.reducer;
