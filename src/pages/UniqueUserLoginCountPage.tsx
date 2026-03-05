import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography ,Grid} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { AppDataGrid } from '@/components/datagrid/AppDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchUniqueUserLoginAllData, fetchUniqueUserLoginSearchData } from '@/features/reports/uniqueUserLoginSlice';
import { UniqueUserLoginRecord } from '@/types';
import { useExcelExport } from '@/hooks/useExcelExport';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface UniqueUserLoginHeaderProps {
  clientId: string;
  fiShortName: string;
  errors: {
    clientId?: string;
    fiShortName?: string;
  };
  onClientIdChange: (value: string) => void;
  onFiShortNameChange: (value: string) => void;
  onSearch: () => void;
  onSearchAll: () => void;
  onClear: () => void;
  onDownloadExcel: () => void;
  onDownloadCSV: () => void;
  isExporting: boolean;
  hasData: boolean;
}

const UniqueUserLoginHeader: FC<UniqueUserLoginHeaderProps> = ({
  clientId,
  fiShortName,
  errors,
  onClientIdChange,
  onFiShortNameChange,
  onSearch,
  onSearchAll,
  onClear,
  onDownloadExcel,
  onDownloadCSV,
  isExporting,
  hasData,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4">
          Unique User Login Count Report
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
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="FI Short Name"
            value={fiShortName}
            onChange={(e) => onFiShortNameChange(e.target.value)}
            error={!!errors.fiShortName}
            helperText={errors.fiShortName}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
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

export const UniqueUserLoginCountPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading } = useAppSelector((state) => state.uniqueUserLogin);

  const [clientId, setClientId] = useState('');
  const [fiShortName, setFiShortName] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [mode, setMode] = useState<'search' | 'all'>('search');
  const [errors, setErrors] = useState<{ clientId?: string; fiShortName?: string }>({});
  const [applied, setApplied] = useState({ clientId: '', fiShortName: '' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    if (!hasApplied) {
      return;
    }

    if (mode === 'all') {
      dispatch(fetchUniqueUserLoginAllData());
    } else {
      dispatch(
        fetchUniqueUserLoginSearchData({
          clientId: applied.clientId || undefined,
          fiShortName: applied.fiShortName || undefined,
        })
      );
    }
  }, [dispatch, applied, hasApplied, mode]);

  const columns = useMemo<GridColDef<UniqueUserLoginRecord>[]>(
    () => {
      // Generate headers with actual dates (last 7 days from today)
      const today = new Date();
      const getDayHeader = (daysAgo: number) => {
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);
        const day = date.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      
      return [
        { field: 'time', headerName: 'Time', width: 120 },
        { field: 'day7', headerName: getDayHeader(6), width: 110 }, // 7 days ago
        { field: 'day6', headerName: getDayHeader(5), width: 110 }, // 6 days ago  
        { field: 'day5', headerName: getDayHeader(4), width: 110 }, // 5 days ago
        { field: 'day4', headerName: getDayHeader(3), width: 110 }, // 4 days ago
        { field: 'day3', headerName: getDayHeader(2), width: 110 }, // 3 days ago
        { field: 'day2', headerName: getDayHeader(1), width: 110 }, // 2 days ago
        { field: 'day1', headerName: getDayHeader(0), width: 110 }, // today
      ];
    },
    []
  );

  // Filter data based on applied search criteria
  const filteredData = useMemo(() => {
    if (!hasApplied) {
      return [];
    }
    return records;
  }, [hasApplied, records]);

  // Excel export hook
  const { exportToExcel, exportToCSV, isExporting } = useExcelExport(
    filteredData,
    columns,
    {
      filename: 'unique-user-login-count-report',
      sheetName: 'Unique User Login',
    }
  );

  return (
    <Box sx={{ p: 2 }}>
      <UniqueUserLoginHeader
        clientId={clientId}
        fiShortName={fiShortName}
        errors={errors}
        onClientIdChange={(value) => {
          if (value === '' || /^[0-9]+$/.test(value)) {
            setClientId(value);
          }
        }}
        onFiShortNameChange={setFiShortName}
        onSearch={() => {
          const nextErrors: { clientId?: string; fiShortName?: string } = {};
          const hasClientId = clientId.trim().length > 0;
          const hasFiShortName = fiShortName.trim().length > 0;

          if (!hasClientId && !hasFiShortName) {
            nextErrors.clientId = 'Client Id or FI Short Name is required';
            nextErrors.fiShortName = 'Client Id or FI Short Name is required';
          }

          setErrors(nextErrors);
          if (Object.keys(nextErrors).length > 0) {
            return;
          }

          setApplied({ clientId: clientId.trim(), fiShortName: fiShortName.trim() });
          setMode('search');
          setHasApplied(true);
        }}
        onSearchAll={() => {
          setErrors({});
          setApplied({ clientId: '', fiShortName: '' });
          setMode('all');
          setHasApplied(true);
        }}
        onClear={() => {
          setClientId('');
          setFiShortName('');
          setErrors({});
          setApplied({ clientId: '', fiShortName: '' });
          setMode('search');
          setHasApplied(false);
        }}
        onDownloadExcel={exportToExcel}
        onDownloadCSV={exportToCSV}
        isExporting={isExporting}
        hasData={filteredData.length > 0}
      />
      <Box sx={{ mt: 2, width: '100%', maxWidth: '100%' }}>
        <AppDataGrid
          rows={filteredData}
          columns={columns}
          loading={hasApplied ? loading : false}
          clientSidePagination={true}
          searchFields={['loginDate', 'loginHour', 'loginCount', 'time']}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Box>
    </Box>
  );
};