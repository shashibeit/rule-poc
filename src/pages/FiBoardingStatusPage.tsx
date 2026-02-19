import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchFiBoardingStatus, FiBoardingStatusRecord } from '@/features/reports/fiBoardingStatusSlice';

const FiBoardingStatusHeader: FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        FI Boarding Status
      </Typography>
    </Box>
  );
};

const FiBoardingStatusGrid = withDataGrid(FiBoardingStatusHeader);

export const FiBoardingStatusPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading, error } = useAppSelector((state) => state.fiBoardingStatus);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchFiBoardingStatus());
  }, [dispatch]);

  const columns = useMemo<GridColDef<FiBoardingStatusRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 140 },
      { field: 'serviceCode', headerName: 'Service Code', width: 140 },
      { field: 'fiName', headerName: 'FI Name', width: 180 },
      { field: 'onFiDetails', headerName: 'On FI Details', width: 160 },
      { field: 'onOrgClientDetails', headerName: 'On Org Client Details', width: 190 },
      { field: 'status', headerName: 'Status', width: 130 },
      { field: 'details', headerName: 'Details', width: 280 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: records,
    columns,
    loading,
    page,
    pageSize,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: (newPageSize) => {
      setPage(0);
      setPageSize(newPageSize);
    },
    clientSidePagination: true,
  };

  return (
    <FiBoardingStatusGrid
      {...props}
      toolbar={
        error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : undefined
      }
    />
  );
};
