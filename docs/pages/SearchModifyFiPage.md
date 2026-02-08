# SearchModifyFiPage

**Source**: `src/pages/SearchModifyFiPage.tsx`

## Route & access
- Route: `/app/portfolio-management/search-modify-fi`
- Roles: `Rule_Reviewer`

## Purpose
Searches for FI records by Client ID or Portfolio Name and displays matching results.

## UI and validation
- Inputs: Client ID or Portfolio Name (at least one required).
- Actions: Search, Search All.

## Data flow (local mock data)
1. Search validates input and filters in-memory `MOCK_ROWS`.
2. Results are paginated locally in the page state.

## Mock data
- Stored in `SearchModifyFiPage.tsx` as `MOCK_ROWS`.
- No mock server calls are made.

## Replace with real API
- Example: `GET /api/portfolio/fi?clientId=...&portfolioName=...`
- Return `{ data, total }` and wire to `withDataGrid` pagination props.
