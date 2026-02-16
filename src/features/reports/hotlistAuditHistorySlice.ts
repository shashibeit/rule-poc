import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface HotlistAuditRecord {
  id?: string;
  clientId: string;
  portfolioName: string;
  hotlistName: string;
  action: string;
  valueFrom: string;
  valueTo: string;
  changedByUser: string;
  timeModified: string;
}

type HotlistAuditRecordInput = Partial<HotlistAuditRecord> & {
  auditActivityXCD?: string;
  FromValue?: string;
  toValue?: string;
  valeuTo?: string;
  portFolioName?: string;
  hotListName?: string;
  createdDateWithSec?: string;
};

interface HotlistAuditState {
  records: HotlistAuditRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: HotlistAuditState = {
  records: [],
  loading: false,
  error: null,
};

const isEmptyRecord = (row: HotlistAuditRecordInput) =>
  Object.values(row).every((value) => value === null || value === undefined || String(value).trim() === '');

const normalizeRecords = (data?: HotlistAuditRecordInput[]) =>
  (data ?? [])
    .filter((row) => !isEmptyRecord(row))
    .map((row, index) => ({
      id: row.id ?? `${row.clientId || 'audit'}-${index + 1}`,
      clientId: row.clientId ?? '',
      portfolioName: row.portfolioName ?? row.portFolioName ?? '',
      hotlistName: row.hotlistName ?? row.hotListName ?? '',
      action: row.action ?? row.auditActivityXCD ?? '',
      valueFrom: row.valueFrom ?? row.FromValue ?? '',
      valueTo: row.valueTo ?? row.valeuTo ?? row.toValue ?? '',
      changedByUser: row.changedByUser ?? '',
      timeModified: row.timeModified ?? row.createdDateWithSec ?? '',
    }));

export const fetchHotlistAuditLogs = createAsyncThunk(
  'reports/fetchHotlistAuditLogs',
  async (params: {
    hotListEntityKeyName: string;
    hotListName: string;
    fromDate?: string;
    toDate?: string;
    changedByUser?: string;
    portFolioName?: string;
  }) => {
    const payload: Record<string, string> = {
      hotListEntityKeyName: params.hotListEntityKeyName,
      hotListName: params.hotListName,
      hotListType: 'CLIENT',
    };

    if (params.fromDate) {
      payload.fromDate = params.fromDate;
    }
    if (params.toDate) {
      payload.toDate = params.toDate;
    }
    if (params.changedByUser) {
      payload.changedByUser = params.changedByUser;
    }
    if (params.portFolioName) {
      payload.portFolioName = params.portFolioName;
    }

    const response = await apiClient.post<{
      code?: string;
      message?: string;
      responseList?: HotlistAuditRecordInput[];
    }>(
      '/rules/v1/getHotListAuditLogs',
      payload
    );
    return response.responseList ?? [];
  }
);

const hotlistAuditHistorySlice = createSlice({
  name: 'hotlistAuditHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotlistAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotlistAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.records = normalizeRecords(action.payload);
      })
      .addCase(fetchHotlistAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load hotlist audit logs';
      });
  },
});

export default hotlistAuditHistorySlice.reducer;
