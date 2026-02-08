import { FC, useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';

interface SearchCgUsingPanHeaderProps {
  mode: 'single' | 'multiple';
  tokenizedPan: string;
  fileName: string;
  error?: string;
  onModeChange: (mode: 'single' | 'multiple') => void;
  onTokenizedPanChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSearch: () => void;
}

const SearchCgUsingPanHeader: FC<SearchCgUsingPanHeaderProps> = ({
  mode,
  tokenizedPan,
  fileName,
  error,
  onModeChange,
  onTokenizedPanChange,
  onFileChange,
  onSearch,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Search CG Using PAN
      </Typography>

      <RadioGroup
        row
        value={mode}
        onChange={(e) => onModeChange(e.target.value as 'single' | 'multiple')}
      >
        <FormControlLabel
          value="single"
          control={<Radio />}
          label="Search by Single Tokenized PAN"
        />
        <FormControlLabel
          value="multiple"
          control={<Radio />}
          label="Search by Multiple Tokenized PAN"
        />
      </RadioGroup>

      <Grid container spacing={2} alignItems="center">
        {mode === 'single' ? (
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Tokenized PAN"
              value={tokenizedPan}
              onChange={(e) => onTokenizedPanChange(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </Grid>
        ) : (
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button variant="outlined" component="label">
                Search By Tokenized PAN Details
                <input
                  hidden
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    onFileChange(file);
                    event.target.value = '';
                  }}
                />
              </Button>
              {fileName && (
                <Typography variant="body2" color="text.secondary">
                  {fileName}
                </Typography>
              )}
            </Box>
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 2 }}>
          <Button variant="contained" onClick={onSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const SearchCgUsingPanGrid = withDataGrid<SearchCgUsingPanHeaderProps>(SearchCgUsingPanHeader);

interface PanResultRecord {
  id: string;
  fiChecked: boolean;
  tokenizedPan: string;
  compromiseIncidentId: string;
  remark: string;
}

const MOCK_ROWS: PanResultRecord[] = [
  {
    id: '1',
    fiChecked: false,
    tokenizedPan: 'TK-0001',
    compromiseIncidentId: 'CI-1001',
    remark: 'Verified',
  },
  {
    id: '2',
    fiChecked: false,
    tokenizedPan: 'TK-0002',
    compromiseIncidentId: 'CI-1002',
    remark: 'Pending',
  },
  {
    id: '3',
    fiChecked: false,
    tokenizedPan: 'TK-0003',
    compromiseIncidentId: 'CI-1003',
    remark: 'Reviewed',
  },
];

export const SearchCgUsingPanPage: FC = () => {
  const [mode, setMode] = useState<'single' | 'multiple'>('single');
  const [tokenizedPan, setTokenizedPan] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [rows, setRows] = useState<PanResultRecord[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<PanResultRecord>[]>(
    () => [
      {
        field: 'fiChecked',
        headerName: 'FI Checked',
        width: 120,
        renderCell: () => <input type="checkbox" />,
        sortable: false,
        filterable: false,
      },
      { field: 'tokenizedPan', headerName: 'Tokenized PAN(s)', width: 180 },
      { field: 'compromiseIncidentId', headerName: 'Compromised Incident ID', width: 220 },
      { field: 'remark', headerName: 'Remark', width: 180 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows,
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
    <SearchCgUsingPanGrid
      {...props}
      mode={mode}
      tokenizedPan={tokenizedPan}
      fileName={fileName}
      error={error}
      onModeChange={(nextMode) => {
        setMode(nextMode);
        setError(undefined);
        setTokenizedPan('');
        setFileName('');
        setRows([]);
        setPage(0);
      }}
      onTokenizedPanChange={setTokenizedPan}
      onFileChange={(file) => {
        setFileName(file?.name ?? '');
      }}
      onSearch={() => {
        if (mode === 'single') {
          const trimmed = tokenizedPan.trim();
          if (!trimmed) {
            setError('Tokenized PAN is required');
            setRows([]);
            return;
          }
          setError(undefined);
          setRows(MOCK_ROWS.filter((row) => row.tokenizedPan === trimmed));
          setPage(0);
          return;
        }

        if (!fileName) {
          setError('Search By Tokenized PAN Details file is required');
          setRows([]);
          return;
        }

        setError(undefined);
        setRows(MOCK_ROWS);
        setPage(0);
      }}
    />
  );
};
