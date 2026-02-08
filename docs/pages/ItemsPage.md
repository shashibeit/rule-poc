# ItemsPage

**Source**: `src/features/items/ItemsPage.tsx`

## Route & access
- Route: Not currently registered in `App.tsx`.
- Intended path (used by navigation in code): `/app/items`.

## Purpose
Lists items with server pagination and a debounced search box.

## UI and validation
- Search box filters items by name/category.
- “View” action navigates to Item Detail.

## Data flow (Redux + mock API)
1. On mount and whenever pagination/search changes, the page dispatches `fetchItems`.
2. `itemsSlice` stores `items` and `total`.
3. `AppDataGrid` renders server-side pagination.

## Mock API
- **GET** `/api/items` (params: `page`, `pageSize`, `search`)

## Replace with real API
- Keep list response shape `{ data, total }`.
