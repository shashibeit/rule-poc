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

            <Route
              path="refresh-staging"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Refresh Staging" />
                </RoleGuard>
              }
            />
            <Route
              path="view-rule-changes"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="View Rule Changes" />
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
                  <PageSkeleton title="Rule Count" />
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
                  <PageSkeleton title="Upload Rule Scheduler" />
                </RoleGuard>
              }
            />
            <Route
              path="rule-history"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Rule History" />
                </RoleGuard>
              }
            />
            <Route
              path="rule-scheduler-history"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Rule Scheduler History" />
                </RoleGuard>
              }
            />

            <Route
              path="card-group/get-cg-count-pans"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Get CG Count and PANs" />
                </RoleGuard>
              }
            />
            <Route
              path="card-group/search-cg-using-pan"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Search CG Using PAN" />
                </RoleGuard>
              }
            />

            <Route
              path="hotlist/fi-hotlist-check"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="FI Hotlist Check" />
                </RoleGuard>
              }
            />
            <Route
              path="hotlist/hotlist-audit-history"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Hotlist Audit History" />
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
                  <PageSkeleton title="Unique User Login Count Report" />
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
                  <PageSkeleton title="Queues Assigned to User Group" />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/users-assigned"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Users Assigned to User Group" />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/roles-assigned"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Roles Assigned to User Group" />
                </RoleGuard>
              }
            />
            <Route
              path="user-group/roles-assigned-sub-tenant-users"
              element={
                <RoleGuard allowedRoles={['admin', 'reviewer']}>
                  <PageSkeleton title="Roles Assigned to Sub-Tenant Users" />
                </RoleGuard>
              }
            />

            <Route index element={<Navigate to="refresh-staging" replace />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
