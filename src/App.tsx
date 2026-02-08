import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { getTheme } from './theme/theme';
import { ColorModeContext } from './theme/colorModeContext';
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
import { AddFiPage } from './pages/AddFiPage';
import { SearchModifyFiPage } from './pages/SearchModifyFiPage';

const getInitialMode = (): PaletteMode => {
  const stored = window.localStorage.getItem('color-mode');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

function App() {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === 'light' ? 'dark' : 'light';
          window.localStorage.setItem('color-mode', next);
          return next;
        });
      },
    }),
    [mode]
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
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
                <RoleGuard allowedRoles={['Rule_Deployer', 'Rule_Reviewer']}>
                  <RefreshStagingPage />
                </RoleGuard>
              }
            />
            <Route
              path="view-rule-changes"
              element={
                <RoleGuard allowedRoles={['Rule_Deployer', 'Rule_Reviewer']}>
                  <ViewRuleChangesPage />
                </RoleGuard>
              }
            />
            <Route
              path="view-staged-rule"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <PageSkeleton title="View Staged Rule" />
                </RoleGuard>
              }
            />
            <Route
              path="download-stage-rules"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <PageSkeleton title="Download Stage Rules" />
                </RoleGuard>
              }
            />
            <Route
              path="rule-count"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <RuleCountPage />
                </RoleGuard>
              }
            />
            <Route
              path="view-prod-rules"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <PageSkeleton title="View Prod Rules" />
                </RoleGuard>
              }
            />
            <Route
              path="upload-rule-scheduler"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <UploadRuleSchedulerPage />
                </RoleGuard>
              }
            />
            <Route
              path="rule-history"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <RuleHistoryPage />
                </RoleGuard>
              }
            />
            <Route
              path="rule-scheduler-history"
              element={
                <RoleGuard allowedRoles={['Rule_Deployer', 'Rule_Reviewer']}>
                  <RuleSchedulerPage />
                </RoleGuard>
              }
            />
            <Route
              path="prod-syncup"
              element={
                <RoleGuard allowedRoles={['Rule_Deployer', 'Rule_Reviewer']}>
                  <PageSkeleton title="Prod Syncup" />
                </RoleGuard>
              }
            />

            <Route
              path="operation-history"
              element={
                <RoleGuard allowedRoles={['Rule_Deployer', 'Rule_Reviewer']}>
                  <RefreshHistoryPage />
                </RoleGuard>
              }
            />

            <Route
              path="card-group/get-cg-count-pans"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <GetCgCountPansPage />
                </RoleGuard>
              }
            />
            <Route
              path="card-group/search-cg-using-pan"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <SearchCgUsingPanPage />
                </RoleGuard>
              }
            />

            <Route
              path="hotlist/fi-hotlist-check"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <FiHotlistCheckPage />
                </RoleGuard>
              }
            />
            <Route
              path="hotlist/hotlist-audit-history"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <HotlistAuditHistoryPage />
                </RoleGuard>
              }
            />

            <Route
              path="user-report"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <UserReportPage />
                </RoleGuard>
              }
            />
            <Route
              path="unique-user-login-count-report"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <UniqueUserLoginCountPage />
                </RoleGuard>
              }
            />

            <Route
              path="portfolio-management/add-fi"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <AddFiPage />
                </RoleGuard>
              }
            />
            <Route
              path="portfolio-management/search-modify-fi"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <SearchModifyFiPage />
                </RoleGuard>
              }
            />
            <Route
              path="portfolio-management/modify-dc-sub-brand"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <PageSkeleton title="Modify DC Sub-Brand" />
                </RoleGuard>
              }
            />
            <Route
              path="portfolio-management/fi-boarding"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <PageSkeleton title="FI Boarding" />
                </RoleGuard>
              }
            />
            <Route
              path="portfolio-management/fi-boarding-status"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <PageSkeleton title="FI Boarding Status" />
                </RoleGuard>
              }
            />

            <Route
              path="user-group/queues-assigned"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <QueuesAssignedToUserGroupPage />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/users-assigned"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <UsersAssignedToUserGroupPage />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/roles-assigned"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
                  <RolesAssignedToUserGroupPage />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/roles-assigned-sub-tenant-users"
              element={
                <RoleGuard allowedRoles={['Rule_Reviewer']}>
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
    </ColorModeContext.Provider>
  );
}

export default App;
