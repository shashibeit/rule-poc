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
import { useExcelExport } from '@/hooks/useExcelExport';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface SearchCgUsingPanHeaderProps {
  mode: 'single' | 'multiple';
  tokenizedPan: string;
  fileName: string;
  error?: string;
  onModeChange: (mode: 'single' | 'multiple') => void;
  onTokenizedPanChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSearch: () => void;
  onDownloadExcel: () => void;
  onDownloadCSV: () => void;
  isExporting: boolean;
  hasData: boolean;
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
  onDownloadExcel,
  onDownloadCSV,
  isExporting,
  hasData,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Search CG Using PAN
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={onDownloadExcel}
            disabled={isExporting || !hasData}
          >
            Download Excel
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={onDownloadCSV}
            disabled={isExporting || !hasData}
          >
            Download CSV
          </Button>
        </Box>
      </Box>

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

  // Excel export hook
  const { exportToExcel, exportToCSV, isExporting } = useExcelExport(
    records,
    columns,
    {
      filename: 'search-cg-using-pan',
      sheetName: 'Search CG Using PAN',
    }
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
      onDownloadExcel={exportToExcel}
      onDownloadCSV={exportToCSV}
      isExporting={isExporting}
      hasData={records.length > 0}
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
