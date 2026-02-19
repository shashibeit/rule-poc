import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface SearchFiDetailsPayload {
  clientId?: string | null;
  clientID?: string;
  fiShortName?: string | null;
}

export interface SearchFiDetailsRecord {
  clientId: string;
  portfolioName: string;
  acro: string;
  fiName: string;
  falcom?: string;
  advice?: string;
  dpsFlag?: string;
  dpsComments?: string;
  dpsLastUpdatedDate?: string;
  dpsLastUpdatedUid?: string;
  chsFlag?: string;
  chsLastUpdatedDate?: string;
  chsLastUpdatedUid?: string;
  cssFlag?: string;
  ccsFlag?: string;
  ccsLastUpdatedDate?: string;
  ccsLastUpdatedUid?: string;
  ccmFlag?: string;
  ccmTenantId?: string;
  ccmServiceFlag?: string;
  ccmLastUpdatedDate?: string;
}

export interface UpdateFiDetailsPayload {
  clientID: string;
  [key: string]: string;
}

interface SearchFiApiResponse {
  code: string;
  message: string;
  responseList: SearchFiDetailsRecord[];
}

interface UpdateFiApiResponse {
  code: string;
  message: string;
  responseList: unknown[];
}

interface SearchModifyFiState {
  records: SearchFiDetailsRecord[];
  searchLoading: boolean;
  searchError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccessMessage: string | null;
}

const initialState: SearchModifyFiState = {
  records: [],
  searchLoading: false,
  searchError: null,
  updateLoading: false,
  updateError: null,
  updateSuccessMessage: null,
};

export const searchFiDetails = createAsyncThunk<
  SearchFiDetailsRecord[],
  SearchFiDetailsPayload,
  { rejectValue: string }
>('searchModifyFi/searchFiDetails', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<SearchFiApiResponse>('/rules/v1/searchFiDetails', payload);

    if (response.code === '200' || response.code.toUpperCase() === 'SUCCESS') {
      return response.responseList ?? [];
    }

    return rejectWithValue(response.message || response.code || 'Unable to fetch FI details');
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to fetch FI details');
  }
});

export const updateFiDetails = createAsyncThunk<
  { code: string; message: string },
  UpdateFiDetailsPayload,
  { rejectValue: string }
>('searchModifyFi/updateFiDetails', async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<UpdateFiApiResponse>('/rules/v1/updateFiDetails', payload);

    if (response.code === '200' || response.code.toUpperCase() === 'SUCCESS') {
      return {
        code: response.code,
        message: response.message || 'FI details updated successfully',
      };
    }

    return rejectWithValue(response.message || response.code || 'Unable to update FI details');
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to update FI details');
  }
});

const searchModifyFiSlice = createSlice({
  name: 'searchModifyFi',
  initialState,
  reducers: {
    clearSearchModifyFiMessage: (state) => {
      state.updateError = null;
      state.updateSuccessMessage = null;
    },
    clearSearchFiError: (state) => {
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFiDetails.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchFiDetails.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.records = action.payload;
      })
      .addCase(searchFiDetails.rejected, (state, action) => {
        state.searchLoading = false;
        state.records = [];
        state.searchError = action.payload || action.error.message || 'Unable to fetch FI details';
      })
      .addCase(updateFiDetails.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccessMessage = null;
      })
      .addCase(updateFiDetails.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccessMessage = action.payload.message;
      })
      .addCase(updateFiDetails.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || action.error.message || 'Unable to update FI details';
      });
  },
});

export const { clearSearchModifyFiMessage, clearSearchFiError } = searchModifyFiSlice.actions;
export default searchModifyFiSlice.reducer;
