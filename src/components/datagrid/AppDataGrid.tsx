import { ReactNode, useMemo, ChangeEvent, FC, useState, useEffect, useRef } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { Box, TextField, InputAdornment, Paper, Typography } from '@mui/material';
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
  showPageJump?: boolean; // Show "Go to page" input in footer
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
  showPageJump = true,
}) => {
  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [pageJumpValue, setPageJumpValue] = useState(String(page + 1));
  const pageInputRef = useRef<HTMLInputElement>(null);
  
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

  // Calculate total pages
  const totalPages = useMemo(() => {
    const count = processedData.totalCount;
    if (!count || count <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(count / pageSize));
  }, [processedData.totalCount, pageSize]);

  // Update local search text when external searchText changes
  useEffect(() => {
    setLocalSearchText(searchText);
  }, [searchText]);

  // Update page input when page changes externally
  useEffect(() => {
    setPageJumpValue(String(page + 1));
  }, [page]);

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

  // Page jump handlers
  const handlePageJumpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    
    // Allow empty string
    if (raw === '') {
      setPageJumpValue('');
      return;
    }
    
    // Only allow numeric input
    if (!/^[0-9]+$/.test(raw)) {
      return;
    }
    
    setPageJumpValue(raw);
  };

  const handlePageJumpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = Number(pageJumpValue);
      const maxPage = Math.max(1, Math.ceil(processedData.totalCount / pageSize));
      if (Number.isFinite(next) && next >= 1 && next <= maxPage) {
        onPageChange(next - 1);
      } else {
        setPageJumpValue(String(page + 1));
      }
      pageInputRef.current?.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setPageJumpValue(String(page + 1));
      pageInputRef.current?.blur();
    }
  };

  const handlePageJumpBlur = () => {
    const next = Number(pageJumpValue);
    const maxPage = Math.max(1, Math.ceil(processedData.totalCount / pageSize));
    
    if (pageJumpValue === '') {
      setPageJumpValue(String(page + 1));
      return;
    }
    
    if (Number.isFinite(next) && next >= 1 && next <= maxPage) {
      onPageChange(next - 1);
    } else {
      setPageJumpValue(String(page + 1));
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

      <Box sx={{ flexGrow: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
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
          sx={{
            border: 'none',
            height: '100%',
            width: '100%',
            '& .MuiDataGrid-columnHeaders': {
              overflow: 'hidden !important',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            '& .MuiDataGrid-main': {
              overflow: 'hidden',
            },
            '& .MuiDataGrid-cell': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
        />
      </Box>

      {showPageJump && (
        <Box
          sx={{
            px: 2,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Go to page
          </Typography>
          <TextField
            value={pageJumpValue}
            onChange={handlePageJumpChange}
            onKeyDown={handlePageJumpKeyDown}
            onBlur={handlePageJumpBlur}
            size="small"
            sx={{ width: 90 }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            inputRef={pageInputRef}
            autoComplete="off"
          />
          <Typography variant="body2" color="text.secondary">
            of {totalPages}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
