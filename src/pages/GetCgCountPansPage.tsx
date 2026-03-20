import { FC, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchCgCountPans, fetchTokenizedPans, CgCountRecord } from '@/features/reports/getCgCountPansSlice';
import { useExcelExport } from '@/hooks/useExcelExport';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface GetCgCountPansHeaderProps {
  compromiseIncidentId: string;
  error?: string;
  onCompromiseIncidentIdChange: (value: string) => void;
  onSearch: () => void;
  onDownloadExcel: () => void;
  onDownloadCSV: () => void;
  onDownloadTokenizedPansExcel: () => void;
  onDownloadTokenizedPansCSV: () => void;
  isExporting: boolean;
  isTokenizedPansLoading: boolean;
  hasData: boolean;
}

const GetCgCountPansHeader: FC<GetCgCountPansHeaderProps> = ({
  compromiseIncidentId,
  error,
  onCompromiseIncidentIdChange,
  onSearch,
  onDownloadExcel,
  onDownloadCSV,
  onDownloadTokenizedPansExcel,
  onDownloadTokenizedPansCSV,
  isExporting,
  isTokenizedPansLoading,
  hasData,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 2 }}>
        <Typography variant="h4">
          Get CG Count and PANs
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={onDownloadTokenizedPansExcel}
              disabled={isTokenizedPansLoading || !hasData}
            >
              Download Tokenized PANs Excel
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={onDownloadTokenizedPansCSV}
              disabled={isTokenizedPansLoading || !hasData}
            >
              Download Tokenized PANs CSV
            </Button>
          </Box>
        </Box>
      </Box>

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

export const GetCgCountPansPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, tokenizedPans, loading, tokenizedPansLoading, error } = useAppSelector(
    (state) => state.getCgCountPans
  );
  const [compromiseIncidentId, setCompromiseIncidentId] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);
  const [hasApplied, setHasApplied] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<CgCountRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 160 },
      { field: 'compromiseIncidentId', headerName: 'Compromise Incident ID', width: 200 },
      { field: 'count', headerName: 'Card Count', width: 120, type: 'number' },
      { field: 'updatedOn', headerName: 'Last updated on (EST)', width: 190 },
      { field: 'updatedBy', headerName: 'Last Updated By', width: 160 },
      { field: 'ruleName', headerName: 'Rule Name', width: 160 },
    ],
    []
  );

  // Tokenized PANs columns
  const tokenizedPansColumns = useMemo(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'fiName', headerName: 'FI Name', width: 150 },
      { field: 'compromisedIncidentId', headerName: 'Compromise Incident ID', width: 200 },
      { field: 'pansAssociated', headerName: 'PANs Associated', width: 200 },
      { field: 'timestamp', headerName: 'Timestamp', width: 190 },
    ] as GridColDef[],
    []
  );

  // Get unique compromise incident IDs from records
  const getUniqueCompromiseIncidentIds = (): string[] => {
    const ids = new Set(records.map((record) => record.compromiseIncidentId));
    return Array.from(ids);
  };

  // Excel export hook for main data
  const { exportToExcel, exportToCSV, isExporting } = useExcelExport(
    hasApplied ? records : [],
    columns,
    {
      filename: 'cg-count-pans',
      sheetName: 'CG Count and PANs',
    }
  );

  // Excel export hook for tokenized PANs
  const { exportToExcel: exportTokenizedPansToExcel, exportToCSV: exportTokenizedPansToCSV } =
    useExcelExport(tokenizedPans, tokenizedPansColumns, {
      filename: 'tokenized-pans',
      sheetName: 'Tokenized PANs',
    });

  const handleDownloadTokenizedPansExcel = async () => {
    const compromiseIds = getUniqueCompromiseIncidentIds();
    if (compromiseIds.length === 0) {
      return;
    }

    try {
      await dispatch(fetchTokenizedPans({ compromiseIncidentIds: compromiseIds })).unwrap();
      exportTokenizedPansToExcel();
    } catch (error) {
      console.error('Failed to fetch tokenized PANs:', error);
    }
  };

  const handleDownloadTokenizedPansCSV = async () => {
    const compromiseIds = getUniqueCompromiseIncidentIds();
    if (compromiseIds.length === 0) {
      return;
    }

    try {
      await dispatch(fetchTokenizedPans({ compromiseIncidentIds: compromiseIds })).unwrap();
      exportTokenizedPansToCSV();
    } catch (error) {
      console.error('Failed to fetch tokenized PANs:', error);
    }
  };

  const props: DataGridViewProps = {
    rows: hasApplied ? records : [],
    columns,
    loading,
    page,
    pageSize,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: (newPageSize) => {
      setPage(0);
      setPageSize(newPageSize);
    },
    // Enable client-side pagination since we have all data loaded
    clientSidePagination: true,
  };

  return (
    <GetCgCountPansGrid
      {...props}
      compromiseIncidentId={compromiseIncidentId}
      error={validationError || error || undefined}
      onCompromiseIncidentIdChange={setCompromiseIncidentId}
      onDownloadExcel={exportToExcel}
      onDownloadCSV={exportToCSV}
      onDownloadTokenizedPansExcel={handleDownloadTokenizedPansExcel}
      onDownloadTokenizedPansCSV={handleDownloadTokenizedPansCSV}
      isExporting={isExporting}
      isTokenizedPansLoading={tokenizedPansLoading}
      hasData={hasApplied && records.length > 0}
      onSearch={() => {
        const trimmed = compromiseIncidentId.trim();
        if (!trimmed) {
          setValidationError('Compromise Incident ID is required');
          setHasApplied(false);
          return;
        }
        if (!/^[A-Za-z][0-9]{3}$/.test(trimmed)) {
          setValidationError('Compromise Incident ID must be 1 letter followed by 3 digits');
          setHasApplied(false);
          return;
        }
        setValidationError(undefined);
        setHasApplied(true);
        setPage(0);
        dispatch(fetchCgCountPans({ compromiseIncidentId: trimmed }));
      }}
    />
  );
};
