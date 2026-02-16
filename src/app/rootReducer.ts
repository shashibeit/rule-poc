import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import usersReducer from '@/features/users/usersSlice';
import itemsReducer from '@/features/items/itemsSlice';
import userReportReducer from '@/features/reports/userReportSlice';
import ruleChangesReducer from '@/features/reports/ruleChangesSlice';
import ruleHistoryReducer from '@/features/reports/ruleHistorySlice';
import ruleSchedulerReducer from '@/features/reports/ruleSchedulerSlice';
import operationHistoryReducer from '@/features/reports/operationHistorySlice';
import uniqueUserLoginReducer from '@/features/reports/uniqueUserLoginSlice';
import ruleCountReducer from '@/features/reports/ruleCountSlice';
import fiHotlistCheckReducer from '@/features/reports/fiHotlistCheckSlice';
import getCgCountPansReducer from '@/features/reports/getCgCountPansSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  items: itemsReducer,
  userReport: userReportReducer,
  ruleChanges: ruleChangesReducer,
  ruleHistory: ruleHistoryReducer,
  ruleScheduler: ruleSchedulerReducer,
  operationHistory: operationHistoryReducer,
  uniqueUserLogin: uniqueUserLoginReducer,
  ruleCount: ruleCountReducer,
  fiHotlistCheck: fiHotlistCheckReducer,
  getCgCountPans: getCgCountPansReducer,
});
