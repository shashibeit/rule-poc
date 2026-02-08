# HotlistAuditHistoryPage

**Source**: `src/pages/HotlistAuditHistoryPage.tsx`

## Route & access
- Route: `/app/hotlist/hotlist-audit-history`
- Roles: `Rule_Reviewer`

## Purpose
Displays audit history for FI hotlist, emergency hotlist, or risky hotlist changes.

## UI and validation
- Mode selector: FI, Emergency, Risky
- Required fields depend on mode:
  - FI: Client Hotlist Name + Key (CLIENT ID)
  - Emergency: Emergency Hotlist Name + Key (Emergency Rule)
  - Risky: Risky Hotlist Name + Key (Rule Name)
- Optional: Portfolio Name, User Name, From/To Date

## Data flow (local mock data)
1. User selects mode and fills required fields.
2. Component validates required fields.
3. If valid, `hasApplied = true` and the grid shows `MOCK_ROWS`.

## Mock data
- Stored in `HotlistAuditHistoryPage.tsx` as `MOCK_ROWS`.
- No mock server calls are made.

## Replace with real API
- Example endpoint: `GET /api/hotlist/audit-history` with query params matching the filters.
- Return `{ data, total }` and use pagination from `withDataGrid`.
