# RuleSchedulerPage

**Source**: `src/pages/RuleSchedulerPage.tsx`

## Route & access
- Route: `/app/rule-scheduler-history`
- Roles: `Rule_Deployer`, `Rule_Reviewer`

## Purpose
Shows scheduler history with filters for Rule Name, Run Window, and Date range.

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
3. `useEffect` dispatches `fetchRuleScheduler`.
4. `ruleSchedulerSlice` stores `records` and `total`.
5. `withDataGrid` renders server-paginated data.

## Mock API
- **GET** `/api/reports/rule-scheduler`
  - Query params: `page`, `pageSize`, `ruleName`, `runWindow`, `startDate`, `endDate`
- Response:
  ```json
  {
    "data": [RuleSchedulerRecord],
    "total": 120,
    "page": 0,
    "pageSize": 10
  }
  ```

## Replace with real API
- Keep the pagination contract and return matching fields for `RuleSchedulerRecord`.
