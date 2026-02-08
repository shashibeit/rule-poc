import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { AppLayout } from './layout/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleGuard } from './routes/RoleGuard';
import { LoginPage } from './features/auth/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PageSkeleton } from './pages/PageSkeleton';
import { UserReportPage } from './pages/UserReportPage';
import { ViewRuleChangesPage } from './pages/ViewRuleChangesPage';
import { RefreshStagingPage } from './pages/RefreshStagingPage';
import { WelcomePage } from './pages/WelcomePage';
import { RuleHistoryPage } from './pages/RuleHistoryPage';
import { RuleSchedulerPage } from './pages/RuleSchedulerPage';
import { RefreshHistoryPage } from './pages/RefreshHistoryPage';
import { UniqueUserLoginCountPage } from './pages/UniqueUserLoginCountPage';
import { RuleCountPage } from './pages/RuleCountPage';
import { UploadRuleSchedulerPage } from './pages/UploadRuleSchedulerPage';
import { GetCgCountPansPage } from './pages/GetCgCountPansPage';
import { SearchCgUsingPanPage } from './pages/SearchCgUsingPanPage';
import { FiHotlistCheckPage } from './pages/FiHotlistCheckPage';
import { HotlistAuditHistoryPage } from './pages/HotlistAuditHistoryPage';
import { QueuesAssignedToUserGroupPage } from './pages/QueuesAssignedToUserGroupPage';
import { UsersAssignedToUserGroupPage } from './pages/UsersAssignedToUserGroupPage';
import { RolesAssignedToUserGroupPage } from './pages/RolesAssignedToUserGroupPage';
import { RolesAssignedToSubTenantUsersPage } from './pages/RolesAssignedToSubTenantUsersPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="unauthorized" element={<UnauthorizedPage />} />

            <Route index element={<WelcomePage />} />

            <Route
              path="refresh-staging"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <RefreshStagingPage />
                </RoleGuard>
              }
            />
            <Route
              path="view-rule-changes"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <ViewRuleChangesPage />
                </RoleGuard>
              }
            />
            <Route
              path="view-staged-rule"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="View Staged Rule" />
                </RoleGuard>
              }
            />
            <Route
              path="download-stage-rules"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Download Stage Rules" />
                </RoleGuard>
              }
            />
            <Route
              path="rule-count"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <RuleCountPage />
                </RoleGuard>
              }
            />
            <Route
              path="view-prod-rules"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="View Prod Rules" />
                </RoleGuard>
              }
            />
            <Route
              path="upload-rule-scheduler"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <UploadRuleSchedulerPage />
                </RoleGuard>
              }
            />
            <Route
              path="rule-history"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <RuleHistoryPage />
                </RoleGuard>
              }
            />
            <Route
              path="rule-scheduler-history"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <RuleSchedulerPage />
                </RoleGuard>
              }
            />

            <Route
              path="operation-history"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <RefreshHistoryPage />
                </RoleGuard>
              }
            />

            <Route
              path="card-group/get-cg-count-pans"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <GetCgCountPansPage />
                </RoleGuard>
              }
            />
            <Route
              path="card-group/search-cg-using-pan"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <SearchCgUsingPanPage />
                </RoleGuard>
              }
            />

            <Route
              path="hotlist/fi-hotlist-check"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <FiHotlistCheckPage />
                </RoleGuard>
              }
            />
            <Route
              path="hotlist/hotlist-audit-history"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <HotlistAuditHistoryPage />
                </RoleGuard>
              }
            />

            <Route
              path="user-report"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <UserReportPage />
                </RoleGuard>
              }
            />
            <Route
              path="unique-user-login-count-report"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <UniqueUserLoginCountPage />
                </RoleGuard>
              }
            />

            <Route
              path="portfolio-management/add-fi"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Add FI" />
                </RoleGuard>
              }
            />
            <Route
              path="portfolio-management/search-modify-fi"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Search/Modify FI" />
                </RoleGuard>
              }
            />
            <Route
              path="portfolio-management/modify-dc-sub-brand"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Modify DC Sub-Brand" />
                </RoleGuard>
              }
            />
            <Route
              path="portfolio-management/fi-boarding"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="FI Boarding" />
                </RoleGuard>
              }
            />
            <Route
              path="portfolio-management/fi-boarding-status"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="FI Boarding Status" />
                </RoleGuard>
              }
            />

            <Route
              path="user-group/queues-assigned"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <QueuesAssignedToUserGroupPage />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/users-assigned"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <UsersAssignedToUserGroupPage />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/roles-assigned"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <RolesAssignedToUserGroupPage />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/roles-assigned-sub-tenant-users"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <RolesAssignedToSubTenantUsersPage />
                </RoleGuard>
              }
            />

          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
