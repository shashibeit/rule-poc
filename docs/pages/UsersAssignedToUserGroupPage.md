# UsersAssignedToUserGroupPage

**Source**: `src/pages/UsersAssignedToUserGroupPage.tsx`

## Route & access
- Route: `/app/user-group/users-assigned`
- Roles: `Rule_Reviewer`

## Purpose
Shows users assigned to user groups, groups with no users, or users without a group.

## UI and validation
- Mode selector: All, No Users, Unassigned.
- No required fields.

## Data flow (local mock data)
- Uses local arrays:
  - `ALL_USERS`
  - `NO_USER_GROUPS`
  - `UNASSIGNED_USERS`
- Local pagination via component state.

## Replace with real API
- Example endpoints:
  - `GET /api/user-group/users?mode=all`
  - `GET /api/user-group/users?mode=no-users`
  - `GET /api/user-group/users?mode=unassigned`
