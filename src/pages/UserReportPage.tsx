import { FC, useEffect, useMemo } from 'react';
import { Box, Button, Typography, TextField, InputAdornment } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchUserReport, setReportPagination } from '@/features/reports/userReportSlice';
import { UserReportRecord } from '@/types';

const UserReportHeader: FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h4">User Report</Typography>
      <Button variant="contained">Export</Button>
    </Box>
  );
};

const UserReportGrid = withDataGrid(UserReportHeader);

export const UserReportPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, total, loading, pagination } = useAppSelector((state) => state.userReport);

  useEffect(() => {
    dispatch(
      fetchUserReport({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.searchText,
      })
    );
  }, [dispatch, pagination.page, pagination.pageSize, pagination.searchText]);

  const columns = useMemo<GridColDef<UserReportRecord>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
      { field: 'role', headerName: 'Role', width: 120 },
      {
        field: 'lastLogin',
        headerName: 'Last Login',
        width: 200,
        valueGetter: (value: string) => new Date(value).toLocaleString(),
      },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: records,
    columns,
    rowCount: total,
    loading,
    page: pagination.page,
    pageSize: pagination.pageSize,
    onPageChange: (newPage) => dispatch(setReportPagination({ page: newPage })),
    onPageSizeChange: (newPageSize) =>
      dispatch(setReportPagination({ page: 0, pageSize: newPageSize })),
    toolbar: (
      <TextField
        value={pagination.searchText}
        onChange={(e) => {
          dispatch(setReportPagination({ page: 0, searchText: e.target.value }));
        }}
        placeholder="Search users..."
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
    ),
  };

  return <UserReportGrid {...props} />;
};
