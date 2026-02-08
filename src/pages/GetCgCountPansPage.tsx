import { FC, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';

interface CgCountRecord {
  id: string;
  clientId: string;
  portfolioName: string;
  compromiseIncidentId: string;
  cardCount: number;
  lastUpdatedOnEst: string;
  lastUpdatedBy: string;
  ruleName: string;
}

interface GetCgCountPansHeaderProps {
  compromiseIncidentId: string;
  error?: string;
  onCompromiseIncidentIdChange: (value: string) => void;
  onSearch: () => void;
}

const GetCgCountPansHeader: FC<GetCgCountPansHeaderProps> = ({
  compromiseIncidentId,
  error,
  onCompromiseIncidentIdChange,
  onSearch,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Get CG Count and PANs
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Compromise Incident ID"
            value={compromiseIncidentId}
            onChange={(e) => onCompromiseIncidentIdChange(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button variant="contained" onClick={onSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const GetCgCountPansGrid = withDataGrid<GetCgCountPansHeaderProps>(GetCgCountPansHeader);

const MOCK_ROWS: CgCountRecord[] = [
  {
    id: '1',
    clientId: '1001',
    portfolioName: 'Alpha',
    compromiseIncidentId: 'CI-001',
    cardCount: 24,
    lastUpdatedOnEst: '2026-02-06 10:15 AM',
    lastUpdatedBy: 'John Smith',
    ruleName: 'Velocity Rule',
  },
  {
    id: '2',
    clientId: '1002',
    portfolioName: 'Beta',
    compromiseIncidentId: 'CI-002',
    cardCount: 12,
    lastUpdatedOnEst: '2026-02-06 02:40 PM',
    lastUpdatedBy: 'Jane Johnson',
    ruleName: 'Risk Rule',
  },
  {
    id: '3',
    clientId: '1003',
    portfolioName: 'Gamma',
    compromiseIncidentId: 'CI-003',
    cardCount: 35,
    lastUpdatedOnEst: '2026-02-05 11:05 AM',
    lastUpdatedBy: 'Michael Brown',
    ruleName: 'Compliance Rule',
  },
];

export const GetCgCountPansPage: FC = () => {
  const [compromiseIncidentId, setCompromiseIncidentId] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasApplied, setHasApplied] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<CgCountRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 160 },
      { field: 'compromiseIncidentId', headerName: 'Compromise Incident ID', width: 200 },
      { field: 'cardCount', headerName: 'Card Count', width: 120, type: 'number' },
      { field: 'lastUpdatedOnEst', headerName: 'Last updated on (EST)', width: 190 },
      { field: 'lastUpdatedBy', headerName: 'Last Updated By', width: 160 },
      { field: 'ruleName', headerName: 'Rule Name', width: 160 },
    ],
    []
  );

  const filteredRows = useMemo(() => {
    if (!hasApplied) {
      return [] as CgCountRecord[];
    }
    const trimmed = compromiseIncidentId.trim();
    if (!trimmed) {
      return [] as CgCountRecord[];
    }
    return MOCK_ROWS.filter((row) => row.compromiseIncidentId === trimmed);
  }, [hasApplied, compromiseIncidentId]);

  const totalRows = filteredRows.length;
  const pagedRows = filteredRows.slice(page * pageSize, page * pageSize + pageSize);

  const props: DataGridViewProps = {
    rows: pagedRows,
    columns,
    rowCount: totalRows,
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
    <GetCgCountPansGrid
      {...props}
      compromiseIncidentId={compromiseIncidentId}
      error={error}
      onCompromiseIncidentIdChange={setCompromiseIncidentId}
      onSearch={() => {
        const trimmed = compromiseIncidentId.trim();
        if (!trimmed) {
          setError('Compromise Incident ID is required');
          setHasApplied(false);
          return;
        }
        setError(undefined);
        setHasApplied(true);
        setPage(0);
      }}
    />
  );
};
