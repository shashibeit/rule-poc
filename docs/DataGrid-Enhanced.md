# Enhanced DataGrid Components

The RoleAudit project now includes enhanced DataGrid components with automatic ID generation and flexible pagination options.

## Features

### 1. Automatic Unique ID Generation

The DataGrid components now automatically handle records that don't have unique IDs:

**ID Generation Strategy:**
1. First tries common ID fields: `id`, `_id`, `uuid`, `key`, `rowId`
2. Falls back to meaningful field combinations: `userId`, `clientId`, `name`, `email`, `code`, `title`
3. Uses content hash + index as last resort

**Usage:**
```tsx
// No getRowId needed - handled automatically
<AppDataGrid
  rows={dataWithoutIds}
  columns={columns}
  // ... other props
/>
```

### 2. Client-Side Pagination

For scenarios where all data is loaded at once and you want client-side pagination:

```tsx
<AppDataGrid
  rows={allData}
  columns={columns}
  clientSidePagination={true}
  searchFields={['name', 'email', 'status']}
  // ... other props
/>
```

### 3. Server-Side Pagination (Default)

Traditional server-side pagination for large datasets:

```tsx
<AppDataGrid
  rows={currentPageData}
  columns={columns}
  rowCount={totalCount}
  clientSidePagination={false} // default
  // ... other props
/>
```

## Components

### AppDataGrid

Direct component with search toolbar:

```tsx
interface AppDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  rowCount?: number; // Optional for client-side pagination
  loading?: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchText?: string;
  onSearchChange?: (searchText: string) => void;
  getRowId?: (row: any) => string | number;
  toolbarActions?: ReactNode;
  searchPlaceholder?: string;
  // New props
  clientSidePagination?: boolean;
  searchFields?: string[]; // Fields to search in for client-side search
}
```

### withDataGrid HOC

Higher-order component that wraps your header component:

```tsx
interface DataGridViewProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  rowCount?: number;
  loading?: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  getRowId?: (row: any) => string | number;
  height?: number | string;
  toolbar?: ReactNode;
  showPageJump?: boolean;
  // New props
  clientSidePagination?: boolean;
  searchText?: string;
  onSearchChange?: (searchText: string) => void;
  searchFields?: string[];
}
```

## Examples

### Client-Side Example with Missing IDs

```tsx
const SAMPLE_DATA = [
  { name: 'John', email: 'john@example.com', status: 'active' },
  { name: 'Jane', status: 'inactive' }, // Missing email
  // Missing id field entirely - will auto-generate
];

export const MyComponent = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <AppDataGrid
      rows={SAMPLE_DATA}
      columns={columns}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      clientSidePagination={true}
      searchFields={['name', 'email', 'status']}
    />
  );
};
```

### Server-Side with Custom ID Generation

```tsx
const customGetRowId = (row: any) => {
  return `${row.clientId}-${row.portfolioName}`;
};

<AppDataGrid
  rows={serverData}
  columns={columns}
  rowCount={totalCount}
  getRowId={customGetRowId}
  clientSidePagination={false}
  // ... other props
/>
```

## Migration Guide

### From Old AppDataGrid

**Before:**
```tsx
<AppDataGrid
  rows={rows}
  columns={columns}
  rowCount={total}
  // ...
/>
```

**After (Server-side - no changes needed):**
```tsx
<AppDataGrid
  rows={rows}
  columns={columns}
  rowCount={total}
  // ... same props work as before
/>
```

**After (Client-side):**
```tsx
<AppDataGrid
  rows={allRows}
  columns={columns}
  clientSidePagination={true}
  searchFields={['field1', 'field2']}
  // rowCount not needed for client-side
/>
```

### From Manual Pagination Logic

**Before:**
```tsx
const pagedRows = allRows.slice(page * pageSize, (page + 1) * pageSize);
const totalCount = allRows.length;

<AppDataGrid
  rows={pagedRows}
  rowCount={totalCount}
  // ... manual paging logic
/>
```

**After:**
```tsx
<AppDataGrid
  rows={allRows}
  clientSidePagination={true}
  // Handles pagination automatically
/>
```

## Utilities

The `@/utils/datagrid` module provides utility functions:

- `generateRowId(row, index)` - Generate unique ID for a row
- `clientSidePaginate(data, page, pageSize)` - Client-side pagination
- `clientSideSearch(data, searchText, fields)` - Client-side search
- `createRowIdGetter()` - Create enhanced row ID getter

## Best Practices

1. **Use client-side pagination** for datasets under 1000 records that are loaded entirely
2. **Use server-side pagination** for large datasets with API pagination
3. **Let the system auto-generate IDs** unless you have specific ID requirements  
4. **Define searchFields** when using client-side pagination with search
5. **Provide meaningful field names** to help with ID generation fallbacks

## Performance Considerations

- **Client-side**: All data loaded at once, good for <1000 records
- **Server-side**: Only current page loaded, better for large datasets
- **ID Generation**: Minimal overhead, cached based on row content
- **Search**: Client-side search is instant, server-side search may have delay