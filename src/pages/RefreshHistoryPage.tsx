import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Typography, TextField, MenuItem, Button, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchOperationHistory, setOperationHistoryPagination } from '@/features/reports/operationHistorySlice';
import { OperationHistoryRecord } from '@/types';

interface OperationHistoryHeaderProps {
  operationType: string;
  error?: string;
  onOperationTypeChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const OperationHistoryHeader: FC<OperationHistoryHeaderProps> = ({
  operationType,
  error,
  onOperationTypeChange,
  onSearch,
  onClear,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Refresh History
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Operation Type"
            value={operationType}
            onChange={(e) => onOperationTypeChange(e.target.value)}
            error={!!error}
            helperText={error}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Synch_Stage">Staging Refreshed</MenuItem>
            <MenuItem value="Sync_Prod">Pruduction Refreshed</MenuItem>
            <MenuItem value="Rule_Schedule">Rule Schedule</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={onSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={onClear}>
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const OperationHistoryGrid = withDataGrid<OperationHistoryHeaderProps>(OperationHistoryHeader);

export const RefreshHistoryPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, total, loading, pagination } = useAppSelector((state) => state.operationHistory);

  const [operationType, setOperationType] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasApplied, setHasApplied] = useState(false);

  const [applied, setApplied] = useState({
    operationType: '',
  });

  useEffect(() => {
    if (!hasApplied) {
      return;
    }

    dispatch(
      fetchOperationHistory({
        page: pagination.page,
        pageSize: pagination.pageSize,
        operationType: applied.operationType,
      })
    );
  }, [dispatch, pagination.page, pagination.pageSize, applied, hasApplied]);

  const columns = useMemo<GridColDef<OperationHistoryRecord>[]>(
    () => [
      { field: 'userId', headerName: 'User Id', width: 140 },
      { field: 'fullName', headerName: 'Full Name', flex: 1, minWidth: 200 },
      { field: 'operationType', headerName: 'Operation Type', width: 200 },
      {
        field: 'createdAt',
        headerName: 'Created Timestamp',
        width: 220,
        valueGetter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
      },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: hasApplied ? records : [],
    columns,
    rowCount: hasApplied ? total : 0,
    loading: hasApplied ? loading : false,
    page: pagination.page,
    pageSize: pagination.pageSize,
    onPageChange: (newPage) => dispatch(setOperationHistoryPagination({ page: newPage })),
    onPageSizeChange: (newPageSize) =>
      dispatch(setOperationHistoryPagination({ page: 0, pageSize: newPageSize })),
  };

  return (
    <OperationHistoryGrid
      {...props}
      operationType={operationType}
      error={error}
      onOperationTypeChange={setOperationType}
      onSearch={() => {
        if (!operationType) {
          setError('Operation Type is required');
          return;
        }
        setError(undefined);
        setApplied({ operationType });
        setHasApplied(true);
        dispatch(setOperationHistoryPagination({ page: 0 }));
      }}
      onClear={() => {
        setOperationType('');
        setError(undefined);
        setApplied({ operationType: '' });
        setHasApplied(false);
        dispatch(setOperationHistoryPagination({ page: 0 }));
      }}
    />
  );
};
