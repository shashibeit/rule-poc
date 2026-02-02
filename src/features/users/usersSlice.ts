import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, PaginationState } from '@/types';
import { apiClient } from '@/api/client';

interface UsersState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: UsersState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    pageSize: 10,
    searchText: '',
  },
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: { page: number; pageSize: number; search: string }) => {
    const response = await apiClient.get<{
      data: User[];
      total: number;
    }>('/users', params);
    return response;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (user: Omit<User, 'id'>) => {
    const response = await apiClient.post<User>('/users', user);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user: User) => {
    const response = await apiClient.put<User>(`/users/${user.id}`, user);
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string) => {
    await apiClient.delete(`/users/${userId}`);
    return userId;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setPagination } = usersSlice.actions;
export default usersSlice.reducer;
