import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import usersReducer from '@/features/users/usersSlice';
import itemsReducer from '@/features/items/itemsSlice';
import userReportReducer from '@/features/reports/userReportSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  items: itemsReducer,
  userReport: userReportReducer,
});
