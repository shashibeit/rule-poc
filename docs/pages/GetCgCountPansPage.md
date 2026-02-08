# GetCgCountPansPage

**Source**: `src/pages/GetCgCountPansPage.tsx`

## Route & access
- Route: `/app/card-group/get-cg-count-pans`
- Roles: `Rule_Reviewer`

## Purpose
Searches for card group (CG) counts by Compromise Incident ID and displays matching records.

## UI and validation
- Input: Compromise Incident ID (required)
- Search button

## Data flow (local mock data)
1. User enters Compromise Incident ID and clicks Search.
2. Component filters the in-memory `MOCK_ROWS` array.
3. Results are paginated locally.

## Mock data
- Stored in `GetCgCountPansPage.tsx` as `MOCK_ROWS`.
- No mock server calls are made.

## Replace with real API
1. Replace the filter logic with a call to an endpoint (e.g., `GET /api/card-group/count-pans`).
2. Return `{ data, total }` and wire to the `withDataGrid` pagination props.
