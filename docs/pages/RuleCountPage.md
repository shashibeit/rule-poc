# RuleCountPage

**Source**: `src/pages/RuleCountPage.tsx`

## Route & access
- Route: `/app/rule-count`
- Roles: `Rule_Reviewer`

## Purpose
Displays count of rules by category and run window for a selected date.

## UI and validation
- Inputs: Date (required), Run Window (required).
- Run Window values: Noon, Evening, Emergency.
- Validation errors are shown inline.

## Data flow (Redux + mock API)
1. User selects Date and Run Window, clicks Search.
2. Component stores filters in `applied` and sets `hasApplied = true`.
3. `useEffect` dispatches `fetchRuleCount` with query params.
4. `ruleCountSlice` stores `records` and `total`.
5. `withDataGrid` renders server-paginated results.

## Mock API
- **GET** `/api/reports/rule-count`
  - Query params: `page`, `pageSize`, `runWindow`, `date` (YYYY-MM-DD)
- Response:
  ```json
  {
    "data": [RuleCountRecord],
    "total": 45,
    "page": 0,
    "pageSize": 10
  }
  ```

## Replace with real API
- Make sure your API accepts `runWindow` and `date` filters.
- Return `{ data, total }` for pagination.
