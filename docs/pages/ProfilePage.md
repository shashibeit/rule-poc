# ProfilePage

**Source**: `src/pages/ProfilePage.tsx`

## Route & access
- Route: Not currently registered in `App.tsx`.
- Access: Intended to be protected.

## Purpose
Allows the logged-in user to view and edit profile fields locally.

## UI and validation
- Fields: name, email, role (role is read-only).
- Validation:
  - Name is required and must be at least 2 characters.
  - Email is required and must be a valid format.

## Data flow (no API)
1. Reads `state.auth.user` from Redux to populate initial form values.
2. Validation is handled by `useFormValidation` hook.
3. “Save” simulates a request using `setTimeout` and shows an alert.

## Mock server
- Not used.

## Replace with real API
1. Replace the `setTimeout` with a real `PUT /profile` (or similar) call.
2. Update the auth/user state with the returned profile.
