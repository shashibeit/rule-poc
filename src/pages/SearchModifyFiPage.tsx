import { FC, useMemo, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';

interface SearchModifyFiHeaderProps {
  clientId: string;
  portfolioName: string;
  errors: { clientId?: string; portfolioName?: string };
  onClientIdChange: (value: string) => void;
  onPortfolioNameChange: (value: string) => void;
  onSearch: () => void;
  onSearchAll: () => void;
}

const SearchModifyFiHeader: FC<SearchModifyFiHeaderProps> = ({
  clientId,
  portfolioName,
  errors,
  onClientIdChange,
  onPortfolioNameChange,
  onSearch,
  onSearchAll,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Search/Modify FI
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Client ID"
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
            error={!!errors.clientId}
            helperText={errors.clientId}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            OR
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={onSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={onSearchAll}>
              Search All
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const SearchModifyFiGrid = withDataGrid<SearchModifyFiHeaderProps>(SearchModifyFiHeader);

interface FiRecord {
  id: string;
  clientId: string;
  portfolioName: string;
  acro: string;
  fiName: string;
}

const MOCK_ROWS: FiRecord[] = [
  { id: '1', clientId: '1001', portfolioName: 'Alpha', acro: 'ALP', fiName: 'Alpha FI' },
  { id: '2', clientId: '1002', portfolioName: 'Beta', acro: 'BET', fiName: 'Beta FI' },
  { id: '3', clientId: '1003', portfolioName: 'Gamma', acro: 'GAM', fiName: 'Gamma FI' },
];

export const SearchModifyFiPage: FC = () => {
  const [clientId, setClientId] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [errors, setErrors] = useState<{ clientId?: string; portfolioName?: string }>({});
  const [rows, setRows] = useState<FiRecord[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<FiRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 180 },
      { field: 'acro', headerName: 'ACRO', width: 120 },
      { field: 'fiName', headerName: 'FI Name', width: 200 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: rows.slice(page * pageSize, page * pageSize + pageSize),
    columns,
    rowCount: rows.length,
    loading: false,
    page,
    pageSize,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: (newPageSize) => {
      setPage(0);
      setPageSize(newPageSize);
    },
  };

  return (
    <SearchModifyFiGrid
      {...props}
      clientId={clientId}
      portfolioName={portfolioName}
      errors={errors}
      onClientIdChange={setClientId}
      onPortfolioNameChange={setPortfolioName}
      onSearch={() => {
        const trimmedClient = clientId.trim();
        const trimmedPortfolio = portfolioName.trim();
        const nextErrors: { clientId?: string; portfolioName?: string } = {};

        if (!trimmedClient && !trimmedPortfolio) {
          nextErrors.clientId = 'Client ID or Portfolio Name is required';
          nextErrors.portfolioName = 'Client ID or Portfolio Name is required';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
          setRows([]);
          return;
        }

        const filtered = MOCK_ROWS.filter((row) => {
          if (trimmedClient && row.clientId !== trimmedClient) return false;
          if (trimmedPortfolio && !row.portfolioName.toLowerCase().includes(trimmedPortfolio.toLowerCase())) return false;
          return true;
        });

        setRows(filtered);
        setPage(0);
      }}
      onSearchAll={() => {
        setErrors({});
        setRows(MOCK_ROWS);
        setPage(0);
      }}
    />
  );
};
