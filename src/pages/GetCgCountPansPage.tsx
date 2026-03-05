import { FC, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchCgCountPans, CgCountRecord } from '@/features/reports/getCgCountPansSlice';
import { useExcelExport } from '@/hooks/useExcelExport';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface GetCgCountPansHeaderProps {
  compromiseIncidentId: string;
  error?: string;
  onCompromiseIncidentIdChange: (value: string) => void;
  onSearch: () => void;
  onDownloadExcel: () => void;
  onDownloadCSV: () => void;
  isExporting: boolean;
  hasData: boolean;
}

const GetCgCountPansHeader: FC<GetCgCountPansHeaderProps> = ({
  compromiseIncidentId,
  error,
  onCompromiseIncidentIdChange,
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
          Get CG Count and PANs
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
  const { records, loading, error } = useAppSelector((state) => state.getCgCountPans);
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

  // Excel export hook
  const { exportToExcel, exportToCSV, isExporting } = useExcelExport(
    hasApplied ? records : [],
    columns,
    {
      filename: 'cg-count-pans',
      sheetName: 'CG Count and PANs',
    }
  );

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
      isExporting={isExporting}
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
