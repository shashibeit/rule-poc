# RolesAssignedToSubTenantUsersPage

**Source**: `src/pages/RolesAssignedToSubTenantUsersPage.tsx`

## Route & access
- Route: `/app/user-group/roles-assigned-sub-tenant-users`
- Roles: `Rule_Reviewer`

## Purpose
Searches roles assigned to sub-tenant users by Client ID or User Name.

## UI and validation
- Inputs: Client ID or User Name (at least one required).
- Actions: Search, Search All.

## Data flow (local mock data)
- Uses `MOCK_ROWS` defined in the page file.
- Results are paginated locally.

## Replace with real API
- Example: `GET /api/sub-tenant/roles?clientId=...&userName=...`
- Return `{ data, total }` and use `withDataGrid` pagination.
