import { ReactNode, useMemo, ChangeEvent, FC, useState, useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { Box, TextField, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import { generateRowId, clientSideSearch, ClientPaginationResult } from '@/utils/datagrid';

export interface AppDataGridProps {
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
  // New props for client-side pagination
  clientSidePagination?: boolean;
  searchFields?: string[]; // Fields to search in for client-side search
}

export const AppDataGrid: FC<AppDataGridProps> = ({
  rows,
  columns,
  rowCount,
  loading = false,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchText = '',
  onSearchChange,
  getRowId,
  toolbarActions,
  searchPlaceholder = 'Search...',
  clientSidePagination = false,
  searchFields = [],
}) => {
  const [localSearchText, setLocalSearchText] = useState(searchText);
  
  // Enhanced row ID generator that handles missing IDs
  const enhancedGetRowId = useMemo(() => {
    if (getRowId) {
      return getRowId;
    }
    return (row: any) => generateRowId(row, rows.indexOf(row));
  }, [getRowId, rows]);

  // Client-side data processing
  const processedData = useMemo((): ClientPaginationResult<any> => {
    if (!clientSidePagination) {
      return {
        paginatedData: rows,
        totalCount: rowCount || rows.length,
        pageCount: Math.ceil((rowCount || rows.length) / pageSize),
      };
    }

    // For client-side pagination, only apply search filtering
    // Let DataGrid handle pagination natively
    let filteredData = rows;
    if (localSearchText && searchFields.length > 0) {
      filteredData = clientSideSearch(rows, localSearchText, searchFields);
    }

    return {
      paginatedData: filteredData, // Return ALL filtered data, not paginated
      totalCount: filteredData.length,
      pageCount: Math.ceil(filteredData.length / pageSize),
    };
  }, [clientSidePagination, rows, localSearchText, searchFields, pageSize, rowCount]);

  // Update local search text when external searchText changes
  useEffect(() => {
    setLocalSearchText(searchText);
  }, [searchText]);

  const debouncedSearch = useMemo(
    () =>
      onSearchChange
        ? debounce((value: string) => {
            onSearchChange(value);
          }, 300)
        : undefined,
    [onSearchChange]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchText(value);
    
    if (clientSidePagination) {
      // For client-side, reset to page 0 when searching
      if (page !== 0) {
        onPageChange(0);
      }
    } else if (debouncedSearch) {
      // For server-side, use debounced search
      debouncedSearch(value);
    }
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page !== page) {
      onPageChange(model.page);
    }
    if (model.pageSize !== pageSize) {
      onPageSizeChange(model.pageSize);
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {(onSearchChange || clientSidePagination) && (
          <TextField
            value={localSearchText}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>{toolbarActions}</Box>
      </Box>

      <Box sx={{ flexGrow: 1, px: 2, pb: 2 }}>
        <DataGrid
          rows={processedData.paginatedData}
          columns={columns}
          rowCount={processedData.totalCount}
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationMode={clientSidePagination ? 'client' : 'server'}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={handlePaginationModelChange}
          getRowId={enhancedGetRowId}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Box>
    </Paper>
  );
};
