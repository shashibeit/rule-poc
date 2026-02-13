import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Typography, TextField, MenuItem, Button, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { AppDataGrid } from '@/components/datagrid/AppDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchOperationHistoryAll } from '@/features/reports/operationHistorySlice';
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

export const RefreshHistoryPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading } = useAppSelector((state) => state.operationHistory);

  const [operationType, setOperationType] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasApplied, setHasApplied] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [applied, setApplied] = useState({
    operationType: '',
  });

  useEffect(() => {
    if (!hasApplied) {
      return;
    }

    dispatch(
      fetchOperationHistoryAll({
        operationType: applied.operationType,
      })
    );
  }, [dispatch, applied, hasApplied]);

  const columns = useMemo<GridColDef<OperationHistoryRecord>[]>(
    () => [
      { field: 'userId', headerName: 'User Id', width: 140 },
      { field: 'fullName', headerName: 'Full Name', flex: 1, minWidth: 200 },
      { field: 'operationType', headerName: 'Operation Type', width: 200 },
      {
        field: 'createTms',
        headerName: 'Created Timestamp',
        width: 220,
        valueGetter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
      },
    ],
    []
  );

  return (
    <Box>
      <OperationHistoryHeader
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
        }}
        onClear={() => {
          setOperationType('');
          setError(undefined);
          setApplied({ operationType: '' });
          setHasApplied(false);
        }}
      />
      <Box sx={{ mt: 2 }}>
        <AppDataGrid
          rows={hasApplied ? records : []}
          columns={columns}
          loading={hasApplied ? loading : false}
          clientSidePagination={true}
          searchFields={['userId', 'fullName', 'operationType']}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Box>
    </Box>
  );
};
