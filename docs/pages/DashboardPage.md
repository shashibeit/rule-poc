# DashboardPage

**Source**: `src/pages/DashboardPage.tsx`

## Route & access
- Route: Not currently registered in `App.tsx`.
- Access: Intended to be protected.

## Purpose
Shows a small dashboard of static stats and a quick-info panel based on the logged-in user’s role.

## UI and validation
- Stat cards (Total Users, Total Items, Active Items).
- Uses `user.role` from Redux auth state to hide/show some cards.

## Data flow (no API)
1. Reads `state.auth.user` from the Redux store.
2. Renders static stats and role-specific text.

## Mock server
- Not used.

## Replace with real API
- Replace the static `stats` array with API calls to fetch real dashboard counts.
