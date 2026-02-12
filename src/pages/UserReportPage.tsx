import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { UserReportRecord } from '@/types';

/**
 * UserReportPage - Now uses CLIENT-SIDE pagination
 * 
 * Features:
 * - All data loaded at once (mock data for demo)
 * - Client-side pagination and search
 * - Multi-field search functionality
 * - No Redux/server calls for pagination
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

// Mock data for client-side pagination - in real app, load this from API once
const MOCK_USER_REPORT_DATA: UserReportRecord[] = (() => {
  const users = [
    { userId: '1001', fullName: 'John Smith', clientId: '1001', portfolioName: 'Alpha' },
    { userId: '1002', fullName: 'Jane Johnson', clientId: '1002', portfolioName: 'Beta' },
    { userId: '1003', fullName: 'Michael Brown', clientId: '1003', portfolioName: 'Gamma' },
    { userId: '1004', fullName: 'Sarah Davis', clientId: '1004', portfolioName: 'Delta' },
    { userId: '1005', fullName: 'David Wilson', clientId: '1005', portfolioName: 'Omega' },
    { userId: '1006', fullName: 'Lisa Anderson', clientId: '1001', portfolioName: 'Alpha' },
    { userId: '1007', fullName: 'Robert Taylor', clientId: '1002', portfolioName: 'Beta' },
    { userId: '1008', fullName: 'Emily White', clientId: '1003', portfolioName: 'Gamma' },
    { userId: '1009', fullName: 'Thomas Lee', clientId: '1004', portfolioName: 'Delta' },
    { userId: '1010', fullName: 'Jessica Garcia', clientId: '1005', portfolioName: 'Omega' },
    { userId: '1011', fullName: 'Daniel Martinez', clientId: '1001', portfolioName: 'Alpha' },
    { userId: '1012', fullName: 'Ashley Rodriguez', clientId: '1002', portfolioName: 'Beta' },
    { userId: '1013', fullName: 'Christopher Moore', clientId: '1003', portfolioName: 'Gamma' },
    { userId: '1014', fullName: 'Amanda Clark', clientId: '1004', portfolioName: 'Delta' },
    { userId: '1015', fullName: 'Matthew Lewis', clientId: '1005', portfolioName: 'Omega' }
  ];
  const ops = [
    'Staging Refreshed', 
    'Production Refreshed', 
    'Rule Schedule', 
    'User Access Updated',
    'Portfolio Sync',
    'Data Export',
    'Report Generated',
    'Audit Completed'
  ];

  // Generate 250 records to show proper pagination
  return Array.from({ length: 250 }, (_v, i) => {
    const created = new Date();
    created.setMinutes(created.getMinutes() - i * 10);
    const user = users[i % users.length];

    return {
      id: String(i + 1),
      userId: user.userId,
      fullName: user.fullName,
      operationType: ops[i % ops.length],
      createdAt: created.toISOString(),
      clientId: user.clientId,
      portfolioName: user.portfolioName,
    };
  });
})();

const UserReportGrid = withDataGrid<UserReportHeaderProps>(UserReportHeader);

export const UserReportPage: FC = () => {
  const [clientId, setClientId] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [hasApplied, setHasApplied] = useState(true); // Start with data loaded
  const [mode, setMode] = useState<'search' | 'all'>('all'); // Start with all records loaded
  const [errors, setErrors] = useState<{ clientId?: string; portfolioName?: string }>({});
  const [applied, setApplied] = useState({ clientId: '', portfolioName: '' });

  // Filter data based on applied search criteria
  const filteredData = useMemo(() => {
    if (!hasApplied) {
      return [];
    }

    if (mode === 'all') {
      return MOCK_USER_REPORT_DATA;
    }

    let data = MOCK_USER_REPORT_DATA;

    if (applied.clientId) {
      data = data.filter((row) => row.clientId === applied.clientId);
    }

    if (applied.portfolioName) {
      const lower = applied.portfolioName.toLowerCase();
      data = data.filter((row) => row.portfolioName?.toLowerCase().includes(lower));
    }

    return data;
  }, [hasApplied, mode, applied]);

  // Show data count for user feedback
  const dataInfo = useMemo(() => {
    if (!hasApplied) {
      return 'Click "Search All" to load all records or enter search criteria';
    }
    const count = filteredData.length;
    const totalPages = Math.ceil(count / pageSize);
    const currentStart = page * pageSize + 1;
    const currentEnd = Math.min((page + 1) * pageSize, count);
    
    if (mode === 'all') {
      return `Showing ${currentStart}-${currentEnd} of ${count} total records (Page ${page + 1} of ${totalPages})`;
    }
    return `Found ${count} records matching your criteria - Showing ${currentStart}-${currentEnd} (Page ${page + 1} of ${totalPages})`;
  }, [hasApplied, filteredData.length, mode, page, pageSize]);

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

    setApplied({ clientId: clientId.trim(), portfolioName: portfolioName.trim() });
    setMode('search');
    setHasApplied(true);
    setPage(0);
    setSearchText('');
  }, [clientId, portfolioName]);

  const handleSearchAll = useCallback(() => {
    setErrors({});
    setApplied({ clientId: '', portfolioName: '' });
    setMode('all');
    setHasApplied(true);
    setPage(0);
    setSearchText('');
  }, []);

  const handleClear = useCallback(() => {
    setClientId('');
    setPortfolioName('');
    setErrors({});
    setApplied({ clientId: '', portfolioName: '' });
    setMode('search');
    setHasApplied(false);
    setPage(0);
    setSearchText('');
  }, []);

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
    rows: filteredData,
    columns,
    loading: false,
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
    searchFields: ['userId', 'fullName', 'operationType', 'clientId', 'portfolioName'],
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
