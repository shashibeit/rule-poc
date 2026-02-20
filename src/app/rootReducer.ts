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
import searchCgUsingPanReducer from '@/features/reports/searchCgUsingPanSlice';
import hotlistAuditHistoryReducer from '@/features/reports/hotlistAuditHistorySlice';
import addFiReducer from '@/features/reports/addFiSlice';
import searchModifyFiReducer from '@/features/reports/searchModifyFiSlice';
import fiBoardingStatusReducer from '@/features/reports/fiBoardingStatusSlice';
import modifyDcSubBrandReducer from '@/features/reports/modifyDcSubBrandSlice';

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
  searchCgUsingPan: searchCgUsingPanReducer,
  hotlistAuditHistory: hotlistAuditHistoryReducer,
  addFi: addFiReducer,
  searchModifyFi: searchModifyFiReducer,
  fiBoardingStatus: fiBoardingStatusReducer,
  modifyDcSubBrand: modifyDcSubBrandReducer,
});
