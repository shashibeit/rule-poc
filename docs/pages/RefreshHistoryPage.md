# RefreshHistoryPage (Operation History)

**Source**: `src/pages/RefreshHistoryPage.tsx`

## Route & access
- Route: `/app/operation-history`
- Roles: `Rule_Deployer`, `Rule_Reviewer`

## Purpose
Shows operation history for refresh and scheduling actions.

## UI and validation
- Input: Operation Type (required)
  - Values: `Synch_Stage`, `Sync_Prod`, `Rule_Schedule`
- Search and Clear actions.

## Data flow (Redux + mock API)
1. User selects Operation Type and clicks Search.
2. Component sets `applied` filter and `hasApplied = true`.
3. `useEffect` dispatches `fetchOperationHistory`.
4. `operationHistorySlice` stores `records` and `total`.
5. `withDataGrid` renders server-paginated data.

## Mock API
- **GET** `/api/reports/operation-history`
  - Query params: `page`, `pageSize`, `operationType`
- Response:
  ```json
  {
    "data": [OperationHistoryRecord],
    "total": 60,
    "page": 0,
    "pageSize": 10
  }
  ```

## Replace with real API
- Keep `operationType` filter and pagination response shape.
