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
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchCompromisedIdByPan, PanSearchRecord } from '@/features/reports/searchCgUsingPanSlice';

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

export const SearchCgUsingPanPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading, error } = useAppSelector((state) => state.searchCgUsingPan);
  const [mode, setMode] = useState<'single' | 'multiple'>('single');
  const [tokenizedPan, setTokenizedPan] = useState('');
  const [fileName, setFileName] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<PanSearchRecord>[]>(
    () => [
      { field: 'pan', headerName: 'PAN', width: 220 },
      { field: 'remarks', headerName: 'Remark', width: 220 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: records,
    columns,
    rowCount: records.length,
    loading,
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
      error={validationError || error || undefined}
      onModeChange={(nextMode) => {
        setMode(nextMode);
        setValidationError(undefined);
        setTokenizedPan('');
        setFileName('');
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
            setValidationError('Tokenized PAN is required');
            return;
          }
          setValidationError(undefined);
          dispatch(fetchCompromisedIdByPan([trimmed]));
          setPage(0);
          return;
        }

        if (!fileName) {
          setValidationError('Search By Tokenized PAN Details file is required');
          return;
        }

        setValidationError('Multiple PAN upload is not supported yet');
        setPage(0);
      }}
    />
  );
};
