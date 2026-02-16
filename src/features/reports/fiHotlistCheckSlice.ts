import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface HotlistRecord {
  id?: string;
  clientId: string;
  core: string;
  lite: string;
  liteBlocking: string;
  protectBuy: string;
  hotlistService: string;
  opServiceCode: string;
  validationStatus: string;
  portfolioName: string;
  hotlistLastUpdatedBy: string;
  hotlistLastUpdatedOn: string;
}

type HotlistRecordInput = Partial<HotlistRecord> & {
  liteAndBlocking?: string;
  dpServiceCode?: string;
  lastupdatedBy?: string;
  lastUpdatedBy?: string;
  lastUpdatedOn?: string;
  hotListName?: string;
  service?: string;
};

interface FiHotlistCheckState {
  records: HotlistRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: FiHotlistCheckState = {
  records: [],
  loading: false,
  error: null,
};

const toHotlistRecord = (row: HotlistRecordInput, index: number): HotlistRecord => ({
  id: row.id ?? `${row.clientId || 'row'}-${index + 1}`,
  clientId: row.clientId ?? '',
  core: row.core ?? '',
  lite: row.lite ?? '',
  liteBlocking: row.liteBlocking ?? row.liteAndBlocking ?? '',
  protectBuy: row.protectBuy ?? '',
  hotlistService: row.hotlistService ?? row.service ?? '',
  opServiceCode: row.opServiceCode ?? row.dpServiceCode ?? '',
  validationStatus: row.validationStatus ?? '',
  portfolioName: row.portfolioName ?? '',
  hotlistLastUpdatedBy: row.hotlistLastUpdatedBy ?? row.lastUpdatedBy ?? row.lastupdatedBy ?? '',
  hotlistLastUpdatedOn: row.hotlistLastUpdatedOn ?? row.lastUpdatedOn ?? '',
});

const normalizeHotlistRecords = (data?: HotlistRecordInput[]) =>
  (data ?? []).map((row, index) => toHotlistRecord(row, index));

export const fetchFiHotlistSearch = createAsyncThunk(
  'reports/fetchFiHotlistSearch',
  async (params: { clientId: string; portfolioName: string; searchDate?: string }) => {
    const response = await apiClient.post<{
      responseList?: HotlistRecordInput[];
      response?: HotlistRecordInput[];
      data?: HotlistRecordInput[];
    } | HotlistRecordInput[]>(
      '/rules/v1/getClientIdDetails',
      params
    );
    if (Array.isArray(response)) {
      return response;
    }
    return response.responseList ?? response.response ?? response.data ?? [];
  }
);

export const fetchFiHotlistAll = createAsyncThunk(
  'reports/fetchFiHotlistAll',
  async () => {
    const response = await apiClient.post<{
      responseList?: HotlistRecordInput[];
      response?: HotlistRecordInput[];
      data?: HotlistRecordInput[];
    } | HotlistRecordInput[]>(
      '/rules/v1/getClientIdDetails',
      { clientId: null, portfolioName: null }
    );
    if (Array.isArray(response)) {
      return response;
    }
    return response.responseList ?? response.response ?? response.data ?? [];
  }
);

const fiHotlistCheckSlice = createSlice({
  name: 'fiHotlistCheck',
  initialState,
  reducers: {
    setFiHotlistRecords: (state, action: PayloadAction<HotlistRecordInput[]>) => {
      state.records = normalizeHotlistRecords(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiHotlistSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiHotlistSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.records = normalizeHotlistRecords(action.payload);
      })
      .addCase(fetchFiHotlistSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load FI hotlist details';
      })
      .addCase(fetchFiHotlistAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiHotlistAll.fulfilled, (state, action) => {
        state.loading = false;
        state.records = normalizeHotlistRecords(action.payload);
      })
      .addCase(fetchFiHotlistAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load FI hotlist details';
      });
  },
});

export const { setFiHotlistRecords } = fiHotlistCheckSlice.actions;
export default fiHotlistCheckSlice.reducer;
