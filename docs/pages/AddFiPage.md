# AddFiPage

**Source**: `src/pages/AddFiPage.tsx`

## Route & access
- Route: `/app/portfolio-management/add-fi`
- Roles: `Rule_Reviewer`

## Purpose
Collects FI information and service settings for creating a new FI.

## UI and validation
- Required fields: Client ID, Portfolio Name, ACRO, Salesforce FI Name, Debit Protect Service, Card Holder Services, DirectProtect Communicate, DirectProtect Compromise Manager, Stop Pay.
- Optional: DirectProtect Service Comments (max 400 chars).

## Data flow (no API)
- Validation is done locally.
- `handleSubmit` currently performs no API call.

## Mock server
- Not used.

## Replace with real API
1. Call `POST /api/portfolio/fi` with the form payload.
2. Show success/error feedback.
