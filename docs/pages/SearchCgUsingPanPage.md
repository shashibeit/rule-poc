# SearchCgUsingPanPage

**Source**: `src/pages/SearchCgUsingPanPage.tsx`

## Route & access
- Route: `/app/card-group/search-cg-using-pan`
- Roles: `Rule_Reviewer`

## Purpose
Searches CG by Tokenized PAN (single or multiple) and displays results.

## UI and validation
- Two modes:
  - Single Tokenized PAN (input required)
  - Multiple Tokenized PAN (file upload required)

## Data flow (local mock data)
1. User selects mode and provides input/file.
2. Component validates input.
3. Results are set from `MOCK_ROWS` (or filtered for single PAN).
4. Local pagination is applied.

## Mock data
- Stored in `SearchCgUsingPanPage.tsx` as `MOCK_ROWS`.
- No mock server calls are made.

## Replace with real API
- For single PAN: call `GET /api/card-group/search?tokenizedPan=...`.
- For multiple PANs: upload file via `POST /api/card-group/search/bulk`.
- Map the API response to the `PanResultRecord` shape.
