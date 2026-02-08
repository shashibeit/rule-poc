# UserReportPage

**Source**: `src/pages/UserReportPage.tsx`

## Route & access
- Route: `/app/user-report`
- Roles: `Rule_Reviewer`

## Purpose
Displays a paginated User Report table with optional filtering by Client ID or Portfolio Name.

## UI and validation
- Inputs: Client Id, Portfolio Name.
- Validations:
  - At least one of Client Id or Portfolio Name is required for “Search”.
- Actions:
  - Search → filters the data.
  - Search All → loads all data.
  - Clear → resets filters and clears table.

## Data flow (Redux + mock API)
1. User clicks Search or Search All.
2. Component sets `applied` filters and `hasApplied = true`.
3. `useEffect` dispatches one of:
   - `fetchUserReportSearch` (POST) when filtered
   - `fetchUserReportAll` (GET) when “Search All”
4. `userReportSlice` stores `records` and `total` in Redux.
5. `withDataGrid` renders the table and server-style pagination.

## Mock API
- **GET** `/api/reports/user-report`
  - Query params: `page`, `pageSize`
- **POST** `/api/reports/user-report/search`
  - Body: `{ page, pageSize, clientId?, portfolioName? }`
- Response shape:
  ```json
  {
    "data": [UserReportRecord],
    "total": 80,
    "page": 0,
    "pageSize": 10
  }
  ```

## Replace with real API
- Keep the same request shapes; swap Mirage handlers in `src/mock/server.ts` for real endpoints.
- Ensure your API returns `{ data, total }` for pagination.
