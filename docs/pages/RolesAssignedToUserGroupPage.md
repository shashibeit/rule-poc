# RolesAssignedToUserGroupPage

**Source**: `src/pages/RolesAssignedToUserGroupPage.tsx`

## Route & access
- Route: `/app/user-group/roles-assigned`
- Roles: `Rule_Reviewer`

## Purpose
Displays roles assigned to user groups or groups with no roles assigned.

## UI and validation
- Mode selector: All User Groups, User Groups with NO Roles.
- No required fields.

## Data flow (local mock data)
- Uses `ALL_ROWS` and `NO_ROLE_ROWS` arrays in the page file.
- Local pagination via component state.

## Replace with real API
- Example endpoints:
  - `GET /api/user-group/roles?mode=all`
  - `GET /api/user-group/roles?mode=no-roles`
