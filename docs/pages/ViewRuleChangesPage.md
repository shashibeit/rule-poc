# ViewRuleChangesPage

**Source**: `src/pages/ViewRuleChangesPage.tsx`

## Route & access
- Route: `/app/view-rule-changes`
- Roles: `Rule_Deployer`, `Rule_Reviewer`

## Purpose
Displays a searchable list of rule changes.

## UI and validation
- Search input in the toolbar.
- No required fields.

## Data flow (Redux + mock API)
1. The page loads and dispatches `fetchRuleChanges`.
2. Typing in the search box updates `pagination.searchText` in Redux.
3. `useEffect` re-fetches data when `page`, `pageSize`, or `searchText` changes.
4. `ruleChangesSlice` stores `records` and `total`.

## Mock API
- **GET** `/api/reports/rule-changes`
  - Query params: `page`, `pageSize`, `search`
- Response:
  ```json
  {
    "data": [RuleChangeRecord],
    "total": 60,
    "page": 0,
    "pageSize": 10
  }
  ```

## Replace with real API
- Keep query params and response contract for paging + searching.
