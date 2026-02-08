# UploadRuleSchedulerPage

**Source**: `src/pages/UploadRuleSchedulerPage.tsx`

## Route & access
- Route: `/app/upload-rule-scheduler`
- Roles: `Rule_Reviewer`

## Purpose
Provides a UI to select and upload a Rule Scheduler file. The current implementation stores the file name only.

## UI and validation
- File picker and “Upload” button.
- Upload is disabled until a file is chosen.

## Data flow
- No API call is made yet. The file name is stored in local state only.

## Mock server
- Not used.

## Replace with real API
1. Use `FormData` to post the file.
2. Example endpoint: `POST /api/reports/rule-scheduler/upload`.
3. Display success/error messages from the response.
