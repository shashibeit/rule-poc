import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Item, PaginationState } from '@/types';
import { apiClient } from '@/api/client';

interface ItemsState {
  items: Item[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  selectedItem: Item | null;
  itemLoading: boolean;
}

const initialState: ItemsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    pageSize: 10,
    searchText: '',
  },
  selectedItem: null,
  itemLoading: false,
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (params: { page: number; pageSize: number; search: string }) => {
    const response = await apiClient.get<{
      data: Item[];
      total: number;
    }>('/items', params);
    return response;
  }
);

export const fetchItemById = createAsyncThunk(
  'items/fetchItemById',
  async (itemId: string) => {
    const response = await apiClient.get<Item>(`/items/${itemId}`);
    return response;
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      .addCase(fetchItemById.pending, (state) => {
        state.itemLoading = true;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.itemLoading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchItemById.rejected, (state) => {
        state.itemLoading = false;
      });
  },
});

export const { setPagination, clearSelectedItem } = itemsSlice.actions;
export default itemsSlice.reducer;
