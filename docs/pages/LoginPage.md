# LoginPage

**Source**: `src/features/auth/LoginPage.tsx`

## Route & access
- Route: `/login`
- Access: Public

## Purpose
Provides a simple role selector for demo login. It does not call any API.

## UI and validation
- Two buttons: “Login as Rule Deployer” and “Login as Rule Reviewer”.
- No form validation (button click only).

## Data flow (no API)
1. User clicks a role button.
2. The page builds a fake `User` object in-memory.
3. Dispatches `login(user)` to the Redux auth slice.
4. Navigates to `/app` (Welcome page).

## Mock server
- No mock server calls here.

## Replace with real API
1. Replace the in-memory user creation with an API call (e.g., `POST /auth/login`).
2. Store the returned user and token in the auth slice.
3. Update `authSlice` to handle token/refresh if needed.
