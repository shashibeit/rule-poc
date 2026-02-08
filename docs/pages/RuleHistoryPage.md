# RuleHistoryPage

**Source**: `src/pages/RuleHistoryPage.tsx`

## Route & access
- Route: `/app/rule-history`
- Roles: `Rule_Reviewer`

## Purpose
Shows rule history records with filters for Rule Name, Run Window, and Date range.

## UI and validation
- Inputs:
  - Start Date (required when Rule Name is empty)
  - End Date (optional)
  - Run Window (optional)
  - Rule Name (optional, max 50 chars)
- Validation rules:
  - If Rule Name is empty, Start Date is required.
  - If Rule Name is present, it must be ≤ 50 chars.

## Data flow (Redux + mock API)
1. User applies filters and clicks Search.
2. Component sets `applied` filters and `hasApplied = true`.
3. `useEffect` dispatches `fetchRuleHistory` with query params.
4. `ruleHistorySlice` stores `records` and `total`.
5. `withDataGrid` renders server-paginated data.

## Mock API
- **GET** `/api/reports/rule-history`
  - Query params: `page`, `pageSize`, `ruleName`, `runWindow`, `startDate`, `endDate`
  - Dates are ISO strings.
- Response:
  ```json
  {
    "data": [RuleHistoryRecord],
    "total": 90,
    "page": 0,
    "pageSize": 10
  }
  ```

## Replace with real API
- Ensure your API supports optional `ruleName` or date range filters.
- Keep the pagination contract.
