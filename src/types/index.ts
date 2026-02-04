export type UserRole = 'admin' | 'reviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface UserReportRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  searchText: string;
}
