# FiHotlistCheckPage

**Source**: `src/pages/FiHotlistCheckPage.tsx`

## Route & access
- Route: `/app/hotlist/fi-hotlist-check`
- Roles: `Rule_Reviewer`

## Purpose
Checks FI hotlist status by single FI, multiple FI (file upload), or by date.

## UI and validation
- Modes:
  - Search by Single FI (Client ID or Portfolio Name required)
  - Search by Multiple FI (file required)
  - Search by Date (Client ID or Portfolio Name required + Date required)
- Results displayed in a DataGrid.

## Data flow (local mock data)
1. User selects mode and enters inputs.
2. Component validates required fields.
3. If valid, sets results from `MOCK_ROWS`.
4. Grid renders local results.

## Mock data
- Stored in `FiHotlistCheckPage.tsx` as `MOCK_ROWS`.
- No mock server calls are made.

## Replace with real API
- Single FI: `GET /api/hotlist/check?clientId=...&portfolioName=...`
- Multiple FI: `POST /api/hotlist/check/bulk` with file
- Date search: `GET /api/hotlist/check?clientId=...&portfolioName=...&date=...`
