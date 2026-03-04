import { ComponentType, ReactNode, useEffect, useMemo, useState, useRef } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
  DataGridProps,
} from '@mui/x-data-grid';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { generateRowId, clientSideSearch, ClientPaginationResult } from '@/utils/datagrid';

export interface DataGridViewProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  rowCount?: number; // Optional for client-side pagination
  loading?: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  getRowId?: (row: any) => string | number;
  height?: number | string;
  toolbar?: ReactNode;
  showPageJump?: boolean;
  // New props for client-side pagination
  clientSidePagination?: boolean;
  searchText?: string;
  onSearchChange?: (searchText: string) => void;
  searchFields?: string[];
  onRowClick?: (row: any) => void;
  dataGridProps?: Partial<DataGridProps>;
}

export const withDataGrid = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const ComponentWithDataGrid = (
    props: P & DataGridViewProps
  ) => {
    const {
      rows,
      columns,
      rowCount,
      loading = false,
      page,
      pageSize,
      onPageChange,
      onPageSizeChange,
      getRowId,
      height = 'auto',
      toolbar,
      showPageJump = true,
      clientSidePagination = false,
      searchText = '',
      onSearchChange,
      searchFields = [],
      onRowClick,
      dataGridProps,
      ...rest
    } = props;

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

    // Update local search text when external searchText changes
    useEffect(() => {
      setLocalSearchText(searchText);
    }, [searchText]);

    const totalPages = useMemo(() => {
      const count = processedData.totalCount;
      if (!count || count <= 0) {
        return 1;
      }
      return Math.max(1, Math.ceil(count / pageSize));
    }, [processedData.totalCount, pageSize]);

    // Update page jump when page changes externally
    useEffect(() => {
      setPageJumpValue(String(page + 1));
    }, [page]);

    const handlePaginationModelChange = (model: GridPaginationModel) => {
      if (model.page !== page) {
        onPageChange(model.page);
        // Maintain focus in the textbox after navigation via arrows
      }
      if (model.pageSize !== pageSize) {
        onPageSizeChange(model.pageSize);
      }
    };

    // Page jump handlers
    const handlePageJumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      
      if (raw === '') {
        setPageJumpValue('');
        return;
      }
      
      if (!/^[0-9]+$/.test(raw)) {
        return;
      }
      
      setPageJumpValue(raw);
    };

    const handlePageJumpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const next = Number(pageJumpValue);
        if (Number.isFinite(next) && next >= 1 && next <= totalPages) {
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
      
      if (pageJumpValue === '') {
        setPageJumpValue(String(page + 1));
        return;
      }
      
      if (Number.isFinite(next) && next >= 1 && next <= totalPages) {
        onPageChange(next - 1);
      } else {
        setPageJumpValue(String(page + 1));
      }
    };



    return (
      <Box>
        <WrappedComponent {...(rest as P)} />
        <Paper
          sx={{
            mt: 2,
            height: height || '100%',
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {toolbar && <Box sx={{ px: 2, pt: 2 }}>{toolbar}</Box>}
          <Box
            sx={{
              flexGrow: 1,
              minHeight: 0,
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
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
              onRowClick={(params) => onRowClick?.(params.row)}
              {...dataGridProps}
              sx={
                dataGridProps?.sx || {
                  border: 'none',
                  height: '100%',
                  width: '100%',
                  maxWidth: '100%',
                  bgcolor: 'background.paper',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: (theme) => theme.palette.grey[300],
                    overflow: 'hidden !important',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 700,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                  '& .MuiDataGrid-sortIcon': {
                    color: 'text.primary',
                  },
                  '& .MuiDataGrid-menuIconButton': {
                    color: 'text.primary',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    bgcolor: 'background.paper',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    bgcolor: 'background.paper',
                  },
                  '& .MuiDataGrid-main': {
                    overflow: 'hidden',
                  },
                  '& .MuiDataGrid-virtualScrollerContent': {
                    width: 'max-content',
                    minWidth: '100%',
                  },
                  '& .MuiDataGrid-cell': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                }
              }
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
      </Box>
    );
  };

  return ComponentWithDataGrid;
};
