import { ComponentType, ReactNode } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';

export interface DataGridViewProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  rowCount: number;
  loading?: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  getRowId?: (row: any) => string | number;
  height?: number | string;
  toolbar?: ReactNode;
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
      ...rest
    } = props;

    const handlePaginationModelChange = (model: GridPaginationModel) => {
      if (model.page !== page) {
        onPageChange(model.page);
      }
      if (model.pageSize !== pageSize) {
        onPageSizeChange(model.pageSize);
      }
    };

    return (
      <Box>
        <WrappedComponent {...(rest as P)} />
        <Paper
          sx={{
            mt: 2,
            height,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {toolbar && <Box sx={{ px: 2, pt: 2 }}>{toolbar}</Box>}
          <Box sx={{ flexGrow: 1, px: 2, py: 2, minHeight: 0 }}>
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
              sx={{
                border: 'none',
                height: '100%',
                bgcolor: 'background.paper',
                '& .MuiDataGrid-virtualScroller': {
                  bgcolor: 'background.paper',
                },
                '& .MuiDataGrid-footerContainer': {
                  bgcolor: 'background.paper',
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    );
  };

  return ComponentWithDataGrid;
};
