# UniqueUserLoginCountPage

**Source**: `src/pages/UniqueUserLoginCountPage.tsx`

## Route & access
- Route: `/app/unique-user-login-count-report`
- Roles: `Rule_Reviewer`

## Purpose
Shows unique user login counts per hour and per day (Day 0–Day 6), with optional filtering by Client ID and Portfolio Name.

## UI and validation
- Inputs: Client Id, Portfolio Name.
- Validations:
  - At least one of Client Id or Portfolio Name is required for “Search”.
- Actions: Search, Search All, Clear.

## Data flow (Redux + mock API)
1. User triggers Search or Search All.
2. Component sets `applied` filters and `hasApplied = true`.
3. `useEffect` dispatches:
   - `fetchUniqueUserLoginSearch` (POST) when filtered
   - `fetchUniqueUserLoginAll` (GET) when “Search All”
4. `uniqueUserLoginSlice` stores `records` and `total`.
5. `withDataGrid` renders server-paginated data.

## Mock API
- **GET** `/api/reports/unique-user-logins`
  - Query params: `page`, `pageSize`
- **POST** `/api/reports/unique-user-logins/search`
  - Body: `{ page, pageSize, clientId?, portfolioName? }`
- Response shape:
  ```json
  {
    "data": [UniqueUserLoginRecord],
    "total": 60,
    "page": 0,
    "pageSize": 10
  }
  ```

## Replace with real API
- Keep pagination contract: `{ data, total }`.
- Map your API response to the `UniqueUserLoginRecord` shape.
