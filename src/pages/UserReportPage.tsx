import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Grid, Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchUserReportAll, fetchUserReportSearch } from '@/features/reports/userReportSlice';
import { UserReportRecord } from '@/types';

/**
 * UserReportPage - Uses CLIENT-SIDE pagination with Redux slice data
 * 
 * Features:
 * - Loads all user report data from mock API via Redux
 * - Client-side pagination and search
 * - Multi-field search functionality (clientId, portfolioName, fullName, userName, groupName, userStatus, emailEnable)
 * - Visual status indicators with chips
 * - No server pagination calls after initial load
 */

interface UserReportHeaderProps {
  clientId: string;
  portfolioName: string;
  dataInfo: string;
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
  dataInfo,
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
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {dataInfo}
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

const UserReportGrid = withDataGrid<UserReportHeaderProps>(UserReportHeader);

export const UserReportPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading } = useAppSelector((state) => state.userReport);
  
  const [clientId, setClientId] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [hasApplied, setHasApplied] = useState(false); // No data loaded initially
  const [mode, setMode] = useState<'search' | 'all'>('search'); // Start with search mode
  const [errors, setErrors] = useState<{ clientId?: string; portfolioName?: string }>({});
  const [applied, setApplied] = useState({ clientId: '', portfolioName: '' });

  // No useEffect - data is only loaded when user clicks buttons

  // Filter data based on applied search criteria
  const filteredData = useMemo(() => {
    if (!hasApplied || !records.length) {
      return [];
    }

    if (mode === 'all') {
      return records;
    }

    let data = records;

    if (applied.clientId) {
      data = data.filter((row) => row.clientId === applied.clientId);
    }

    if (applied.portfolioName) {
      const lower = applied.portfolioName.toLowerCase();
      data = data.filter((row) => row.portfolioName?.toLowerCase().includes(lower));
    }

    return data;
  }, [hasApplied, mode, applied, records]);

  // Show data count for user feedback
  const dataInfo = useMemo(() => {
    if (loading) {
      return 'Loading data...';
    }
    if (!hasApplied) {
      return 'Click "Search All" to load all records or enter search criteria and click "Search"';
    }
    if (!records.length) {
      return 'No records found';
    }
    const count = filteredData.length;
    const totalPages = Math.ceil(count / pageSize);
    const currentStart = page * pageSize + 1;
    const currentEnd = Math.min((page + 1) * pageSize, count);
    
    if (mode === 'all') {
      return `Showing ${currentStart}-${currentEnd} of ${count} total records (Page ${page + 1} of ${totalPages})`;
    }
    return `Found ${count} records matching your criteria - Showing ${currentStart}-${currentEnd} (Page ${page + 1} of ${totalPages})`;
  }, [loading, hasApplied, records.length, filteredData.length, mode, page, pageSize]);

  const handleSearch = useCallback(() => {
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

    // Set applied filters and fetch data
    const searchParams = { clientId: clientId.trim(), portfolioName: portfolioName.trim() };
    setApplied(searchParams);
    setMode('search');
    setHasApplied(true);
    setPage(0);
    setSearchText('');
    
    // Make API call with search filters
    dispatch(fetchUserReportSearch({
      page: 0,
      pageSize: 1000,
      clientId: searchParams.clientId || undefined,
      portfolioName: searchParams.portfolioName || undefined,
    }));
  }, [clientId, portfolioName, dispatch]);

  const handleSearchAll = useCallback(() => {
    setErrors({});
    setApplied({ clientId: '', portfolioName: '' });
    setMode('all');
    setHasApplied(true);
    setPage(0);
    setSearchText('');
    
    // Make API call to fetch all data
    dispatch(fetchUserReportAll({ page: 0, pageSize: 1000 }));
  }, [dispatch]);

  const handleClear = useCallback(() => {
    setClientId('');
    setPortfolioName('');
    setErrors({});
    setApplied({ clientId: '', portfolioName: '' });
    setMode('search');
    setHasApplied(false); // Clear data
    setPage(0);
    setSearchText('');
  }, []);

  const columns = useMemo<GridColDef<UserReportRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 150 },
      { field: 'fullName', headerName: 'Full Name', flex: 1, minWidth: 180 },
      { field: 'userName', headerName: 'User Name', width: 150 },
      { field: 'groupName', headerName: 'Group Name', width: 160 },
      { 
        field: 'userStatus', 
        headerName: 'User Status', 
        width: 120,
        renderCell: (params) => {
          const status = params.value;
          const getColor = (status: string) => {
            switch (status?.toLowerCase()) {
              case 'active': return 'success';
              case 'inactive': return 'error';
              case 'pending': return 'warning';
              default: return 'default';
            }
          };
          return (
            <Chip 
              label={status || 'Unknown'} 
              size="small" 
              color={getColor(status) as any}
            />
          );
        }
      },
      { 
        field: 'emailEnable', 
        headerName: 'Email Enabled', 
        width: 130,
        renderCell: (params) => (
          <Chip 
            label={params.value || 'Unknown'} 
            size="small" 
            color={params.value === 'Yes' ? 'success' : 'default'}
          />
        )
      },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: filteredData,
    columns,
    loading,
    page,
    pageSize,
    onPageChange: setPage,
    onPageSizeChange: (newPageSize) => {
      setPageSize(newPageSize);
      setPage(0);
    },
    // Enable client-side pagination and search
    clientSidePagination: true,
    searchText,
    onSearchChange: setSearchText,
    searchFields: ['clientId', 'portfolioName', 'fullName', 'userName', 'groupName', 'userStatus', 'emailEnable'],
  };

  return (
    <UserReportGrid
      {...props}
      clientId={clientId}
      portfolioName={portfolioName}
      dataInfo={dataInfo}
      errors={errors}
      onClientIdChange={(value) => {
        if (value === '' || /^[0-9]+$/.test(value)) {
          setClientId(value);
        }
      }}
      onPortfolioNameChange={setPortfolioName}
      onSearch={handleSearch}
      onSearchAll={handleSearchAll}
      onClear={handleClear}
    />
  );
};
