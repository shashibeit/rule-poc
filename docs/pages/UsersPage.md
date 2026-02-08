# UsersPage

**Source**: `src/features/users/UsersPage.tsx`

## Route & access
- Route: Not currently registered in `App.tsx`.
- Intended path (used by navigation in code): `/app/users`.

## Purpose
Provides CRUD management for users using a server-paginated data grid and a modal dialog.

## UI and validation
- Search box (debounced) to filter users.
- Add, Edit, Delete actions.
- Validation is handled in `UserDialog` for form fields.

## Data flow (Redux + mock API)
1. On mount and whenever pagination/search changes, the page dispatches `fetchUsers`.
2. `usersSlice` stores `users` and `total`.
3. `AppDataGrid` renders server-side pagination and a debounced search.
4. Add/Edit uses `UserDialog`, which dispatches `createUser` or `updateUser`.
5. Delete dispatches `deleteUser` and then refreshes the list.

## Mock API
- **GET** `/api/users` (params: `page`, `pageSize`, `search`)
- **POST** `/api/users`
- **PUT** `/api/users/:id`
- **DELETE** `/api/users/:id`

## Replace with real API
- Keep pagination contract with `{ data, total }` for list retrieval.
- Ensure create/update return the new or updated user record.
