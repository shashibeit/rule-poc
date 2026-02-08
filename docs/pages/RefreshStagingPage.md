# RefreshStagingPage

**Source**: `src/pages/RefreshStagingPage.tsx`

## Route & access
- Route: `/app/refresh-staging`
- Roles: `Rule_Deployer`, `Rule_Reviewer`

## Purpose
Triggers a staging refresh and displays the result message.

## UI and validation
- No inputs.
- Shows a success alert after the API response.

## Data flow (mock API)
1. On mount, the page sends a POST request to refresh staging.
2. Response message is stored in state and displayed.

## Mock API
- **POST** `/api/reports/refresh-staging`
- Response:
  ```json
  { "success": true, "message": "Staging refresh is completed successfully" }
  ```

## Replace with real API
- Swap the endpoint with a real refresh API.
- Keep the response format or update UI handling to match your API.
