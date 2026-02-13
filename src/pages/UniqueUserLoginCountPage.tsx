import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography ,Grid} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { AppDataGrid } from '@/components/datagrid/AppDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchUniqueUserLoginAllData, fetchUniqueUserLoginSearchData } from '@/features/reports/uniqueUserLoginSlice';
import { UniqueUserLoginRecord } from '@/types';

interface UniqueUserLoginHeaderProps {
  clientId: string;
  fiShortName: string;
  errors: {
    clientId?: string;
    fiShortName?: string;
  };
  onClientIdChange: (value: string) => void;
  onFiShortNameChange: (value: string) => void;
  onSearch: () => void;
  onSearchAll: () => void;
  onClear: () => void;
}

const UniqueUserLoginHeader: FC<UniqueUserLoginHeaderProps> = ({
  clientId,
  fiShortName,
  errors,
  onClientIdChange,
  onFiShortNameChange,
  onSearch,
  onSearchAll,
  onClear,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Unique User Login Count Report
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Client Id"
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
            error={!!errors.clientId}
            helperText={errors.clientId}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="FI Short Name"
            value={fiShortName}
            onChange={(e) => onFiShortNameChange(e.target.value)}
            error={!!errors.fiShortName}
            helperText={errors.fiShortName}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={onSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={onSearchAll}>
              Search All
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

export const UniqueUserLoginCountPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading } = useAppSelector((state) => state.uniqueUserLogin);

  const [clientId, setClientId] = useState('');
  const [fiShortName, setFiShortName] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [mode, setMode] = useState<'search' | 'all'>('search');
  const [errors, setErrors] = useState<{ clientId?: string; fiShortName?: string }>({});
  const [applied, setApplied] = useState({ clientId: '', fiShortName: '' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    if (!hasApplied) {
      return;
    }

    if (mode === 'all') {
      dispatch(fetchUniqueUserLoginAllData());
    } else {
      dispatch(
        fetchUniqueUserLoginSearchData({
          clientId: applied.clientId || undefined,
          fiShortName: applied.fiShortName || undefined,
        })
      );
    }
  }, [dispatch, applied, hasApplied, mode]);

  const columns = useMemo<GridColDef<UniqueUserLoginRecord>[]>(
    () => [
      { field: 'loginDate', headerName: 'Login Date', width: 130 },
      { field: 'loginHour', headerName: 'Login Hour', width: 120 },
      { field: 'loginCount', headerName: 'Login Count', width: 130 },
      { field: 'time', headerName: 'Time', width: 120 },
      { field: 'day1', headerName: 'Day 1', width: 110 },
      { field: 'day2', headerName: 'Day 2', width: 110 },
      { field: 'day3', headerName: 'Day 3', width: 110 },
      { field: 'day5', headerName: 'Day 5', width: 110 },
      { field: 'day6', headerName: 'Day 6', width: 110 },
      { field: 'day7', headerName: 'Day 7', width: 110 },
    ],
    []
  );

  return (
    <Box sx={{ p: 2 }}>
      <UniqueUserLoginHeader
        clientId={clientId}
        fiShortName={fiShortName}
        errors={errors}
        onClientIdChange={(value) => {
          if (value === '' || /^[0-9]+$/.test(value)) {
            setClientId(value);
          }
        }}
        onFiShortNameChange={setFiShortName}
        onSearch={() => {
          const nextErrors: { clientId?: string; fiShortName?: string } = {};
          const hasClientId = clientId.trim().length > 0;
          const hasFiShortName = fiShortName.trim().length > 0;

          if (!hasClientId && !hasFiShortName) {
            nextErrors.clientId = 'Client Id or FI Short Name is required';
            nextErrors.fiShortName = 'Client Id or FI Short Name is required';
          }

          setErrors(nextErrors);
          if (Object.keys(nextErrors).length > 0) {
            return;
          }

          setApplied({ clientId: clientId.trim(), fiShortName: fiShortName.trim() });
          setMode('search');
          setHasApplied(true);
        }}
        onSearchAll={() => {
          setErrors({});
          setApplied({ clientId: '', fiShortName: '' });
          setMode('all');
          setHasApplied(true);
        }}
        onClear={() => {
          setClientId('');
          setFiShortName('');
          setErrors({});
          setApplied({ clientId: '', fiShortName: '' });
          setMode('search');
          setHasApplied(false);
        }}
      />
      <Box sx={{ mt: 2, width: '100%', maxWidth: '100%' }}>
        <AppDataGrid
          rows={hasApplied ? records : []}
          columns={columns}
          loading={hasApplied ? loading : false}
          clientSidePagination={true}
          searchFields={['loginDate', 'loginHour', 'loginCount', 'time']}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Box>
    </Box>
  );
};