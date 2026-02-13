export type UserRole = 'Rule_Deployer' | 'Rule_Reviewer';

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
  clientId: string;
  portfolioName: string;
  fullName: string;
  userName: string;
  groupName: string;
  userStatus: string;
  emailEnable: string;
}

export interface UniqueUserLoginRecord {
  id: string;
  loginDate: string;
  loginHour: string;
  loginCount: string;
  time: string;
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;
  day6: string;
  day7: string;
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
  ruleSetName: string;
  ruleName: string;
  ruleMode: string;
  ruleActvIndc: string;
  crteTms: string;
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
  createTms: string;
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
