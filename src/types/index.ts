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
  userId: string;
  fullName: string;
  operationType: string;
  createdAt: string;
  clientId?: string;
  portfolioName?: string;
}

export interface UniqueUserLoginRecord {
  id: string;
  time: string;
  day6: number;
  day5a: number;
  day5b: number;
  day4: number;
  day3: number;
  day2: number;
  day1: number;
  day0: number;
  clientId?: string;
  portfolioName?: string;
}

export interface RuleCountRecord {
  id: string;
  ruleCategoryName: string;
  ruleSetName: string;
  action: string;
  ruleCount: number;
}

export interface RuleChangeRecord {
  id: string;
  ruleCategory: string;
  ruleSet: string;
  ruleName: string;
  ruleMode: string;
  compare: string;
}

export interface RuleHistoryRecord {
  id: string;
  ruleCategory: string;
  ruleSet: string;
  ruleName: string;
  mode: string;
  ruleIndicator: string;
  createdAt: string;
}

export interface RuleSchedulerRecord {
  id: string;
  ruleCategory: string;
  ruleSet: string;
  ruleName: string;
  mode: string;
  ruleModeCode: string;
  activeIndicator: 'Y' | 'N';
  scheduleDate: string;
  scheduleTime: string;
  approverFullName: string;
  approverSetValue: string;
  ownerFullName: string;
  typeDescription: string;
  ruleModeDescription: string;
  schedulerFullName: string;
  systemName: string;
  financierEmailId: string;
  financerName: string;
  formStatValue: string;
  actionTypeValue: string;
}

export interface OperationHistoryRecord {
  id: string;
  userId: string;
  fullName: string;
  operationType: string;
  createdAt: string;
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
