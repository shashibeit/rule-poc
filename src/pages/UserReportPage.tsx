import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchUserReportAll, fetchUserReportSearch, setReportPagination } from '@/features/reports/userReportSlice';
import { UserReportRecord } from '@/types';

interface UserReportHeaderProps {
  clientId: string;
  portfolioName: string;
  errors: {
    clientId?: string;
    portfolioName?: string;
  };
  onClientIdChange: (value: string) => void;
  onPortfolioNameChange: (value: string) => void;
  onSearch: () => void;
  onSearchAll: () => void;
  onClear: () => void;
}

const UserReportHeader: FC<UserReportHeaderProps> = ({
  clientId,
  portfolioName,
  errors,
  onClientIdChange,
  onPortfolioNameChange,
  onSearch,
  onSearchAll,
  onClear,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Report
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
            label="Portfolio Name"
            value={portfolioName}
            onChange={(e) => onPortfolioNameChange(e.target.value)}
            error={!!errors.portfolioName}
            helperText={errors.portfolioName}
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

const UserReportGrid = withDataGrid(UserReportHeader);

export const UserReportPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, total, loading, pagination } = useAppSelector((state) => state.userReport);
  const [clientId, setClientId] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [mode, setMode] = useState<'search' | 'all'>('search');
  const [errors, setErrors] = useState<{ clientId?: string; portfolioName?: string }>({});
  const [applied, setApplied] = useState({ clientId: '', portfolioName: '' });

  useEffect(() => {
    if (!hasApplied) {
      return;
    }

    if (mode === 'all') {
      dispatch(
        fetchUserReportAll({
          page: pagination.page,
          pageSize: pagination.pageSize,
        })
      );
    } else {
      dispatch(
        fetchUserReportSearch({
          page: pagination.page,
          pageSize: pagination.pageSize,
          clientId: applied.clientId || undefined,
          portfolioName: applied.portfolioName || undefined,
        })
      );
    }
  }, [dispatch, pagination.page, pagination.pageSize, applied, hasApplied, mode]);

  const columns = useMemo<GridColDef<UserReportRecord>[]>(
    () => [
      { field: 'userId', headerName: 'User Id', width: 140 },
      { field: 'fullName', headerName: 'Full Name', flex: 1, minWidth: 200 },
      { field: 'operationType', headerName: 'Operation Type', width: 200 },
      {
        field: 'createdAt',
        headerName: 'Created Timestamp',
        width: 200,
        valueGetter: (value: string) => new Date(value).toLocaleString(),
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
    onPageChange: (newPage) => dispatch(setReportPagination({ page: newPage })),
    onPageSizeChange: (newPageSize) =>
      dispatch(setReportPagination({ page: 0, pageSize: newPageSize })),
  };

  return (
    <UserReportGrid
      {...props}
      clientId={clientId}
      portfolioName={portfolioName}
      errors={errors}
      onClientIdChange={(value) => {
        if (value === '' || /^[0-9]+$/.test(value)) {
          setClientId(value);
        }
      }}
      onPortfolioNameChange={setPortfolioName}
      onSearch={() => {
        const nextErrors: { clientId?: string; portfolioName?: string } = {};
        const hasClientId = clientId.trim().length > 0;
        const hasPortfolio = portfolioName.trim().length > 0;

        if (!hasClientId && !hasPortfolio) {
          nextErrors.clientId = 'Client Id or Portfolio Name is required';
          nextErrors.portfolioName = 'Client Id or Portfolio Name is required';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
          return;
        }

        setApplied({ clientId: clientId.trim(), portfolioName: portfolioName.trim() });
        setMode('search');
        setHasApplied(true);
        dispatch(setReportPagination({ page: 0 }));
      }}
      onSearchAll={() => {
        setErrors({});
        setApplied({ clientId: '', portfolioName: '' });
        setMode('all');
        setHasApplied(true);
        dispatch(setReportPagination({ page: 0 }));
      }}
      onClear={() => {
        setClientId('');
        setPortfolioName('');
        setErrors({});
        setApplied({ clientId: '', portfolioName: '' });
        setMode('search');
        setHasApplied(false);
        dispatch(setReportPagination({ page: 0 }));
      }}
    />
  );
};
