# QueuesAssignedToUserGroupPage

**Source**: `src/pages/QueuesAssignedToUserGroupPage.tsx`

## Route & access
- Route: `/app/user-group/queues-assigned`
- Roles: `Rule_Reviewer`

## Purpose
Searches queues assigned to a user group and displays queue mappings.

## UI and validation
- Input: User Group (required for “Search”).
- Actions: Search, Search All User Groups, Search All With No Groups.

## Data flow (local mock data)
- Uses `MOCK_ROWS` and `NO_GROUP_ROWS` arrays in the page file.
- Filters by `userGroupName` for Search.
- Local pagination via component state.

## Replace with real API
- `GET /api/user-group/queues?userGroup=...`
- `GET /api/user-group/queues?noGroups=true`
