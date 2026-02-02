import { ReactNode, useMemo, ChangeEvent, FC } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { Box, TextField, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';

export interface AppDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  rowCount: number;
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
}) => {
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
    if (debouncedSearch) {
      debouncedSearch(event.target.value);
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
        {onSearchChange && (
          <TextField
            defaultValue={searchText}
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
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={handlePaginationModelChange}
          getRowId={getRowId}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Box>
    </Paper>
  );
};
