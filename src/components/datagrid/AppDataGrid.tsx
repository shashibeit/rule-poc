import { ReactNode, useMemo, ChangeEvent, FC, useState, useEffect, useCallback, useRef } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
  GridFooterContainer,
  GridPagination,
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
  const [pageInput, setPageInput] = useState(String(page + 1));
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

  // Update page input when page changes
  useEffect(() => {
    setPageInput(String(page + 1));
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
      // Maintain focus in the textbox after navigation via arrows
      setTimeout(() => {
        pageInputRef.current?.focus();
      }, 0);
    }
    if (model.pageSize !== pageSize) {
      onPageSizeChange(model.pageSize);
    }
  };

  // Custom footer with page jump functionality
  const Footer = useCallback(() => (
    <GridFooterContainer
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1,
        gap: 2,
      }}
    >
      <GridPagination />
      {showPageJump && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Go to page
          </Typography>
          <TextField
            value={pageInput}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                setPageInput('');
                return;
              }
              if (!/^[0-9]+$/.test(raw)) {
                return;
              }
              setPageInput(raw);
              
              // Navigate immediately when valid page number is entered
              const pageNum = Number(raw);
              if (Number.isFinite(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                onPageChange(pageNum - 1);
                // Maintain focus in the textbox after navigation
                setTimeout(() => {
                  pageInputRef.current?.focus();
                }, 0);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const next = Number(pageInput);
                if (Number.isFinite(next)) {
                  const clamped = Math.min(Math.max(1, next), totalPages);
                  onPageChange(clamped - 1);
                } else {
                  setPageInput(String(page + 1));
                }
              }
            }}
            onBlur={() => {
              const next = Number(pageInput);
              if (pageInput === '') {
                setPageInput(String(page + 1));
                return;
              }
              if (Number.isFinite(next)) {
                const clamped = Math.min(Math.max(1, next), totalPages);
                onPageChange(clamped - 1);
              }
            }}
            size="small"
            sx={{ width: 90 }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            inputRef={pageInputRef}
          />
          <Typography variant="body2" color="text.secondary">
            of {totalPages}
          </Typography>
        </Box>
      )}
    </GridFooterContainer>
  ), [showPageJump, pageInput, totalPages, page, onPageChange]);

  const slots = useMemo(() => ({ footer: Footer }), [Footer]);

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
          slots={slots}
          sx={{ border: 'none' }}
        />
      </Box>
    </Paper>
  );
};
