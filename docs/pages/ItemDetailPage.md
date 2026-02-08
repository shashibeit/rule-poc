# ItemDetailPage

**Source**: `src/features/items/ItemDetailPage.tsx`

## Route & access
- Route: Not currently registered in `App.tsx`.
- Intended path: `/app/items/:id`.

## Purpose
Shows details for a single item.

## UI and validation
- Displays item name, status, category, created date.
- Shows loading state and “Item not found” state.

## Data flow (Redux + mock API)
1. Reads `id` from route params.
2. Dispatches `fetchItemById(id)`.
3. `itemsSlice` stores `selectedItem`.
4. On unmount, `clearSelectedItem()` resets the state.

## Mock API
- **GET** `/api/items/:id`

## Replace with real API
- Ensure the API returns a single item matching the `Item` type.
