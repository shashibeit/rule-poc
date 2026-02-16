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
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchFiHotlistAll,
  fetchFiHotlistSearch,
  HotlistRecord,
  setFiHotlistRecords,
} from '@/features/reports/fiHotlistCheckSlice';

const MOCK_ROWS: HotlistRecord[] = [
  {
    id: '1',
    clientId: '1001',
    core: 'Yes',
    lite: 'No',
    liteBlocking: 'No',
    protectBuy: 'Yes',
    hotlistService: 'Enabled',
    opServiceCode: 'OP-01',
    validationStatus: 'Valid',
    portfolioName: 'Alpha',
    hotlistLastUpdatedBy: 'John Smith',
    hotlistLastUpdatedOn: '2026-02-06 10:15 AM',
  },
  {
    id: '2',
    clientId: '1002',
    core: 'Yes',
    lite: 'Yes',
    liteBlocking: 'Yes',
    protectBuy: 'No',
    hotlistService: 'Disabled',
    opServiceCode: 'OP-07',
    validationStatus: 'Pending',
    portfolioName: 'Beta',
    hotlistLastUpdatedBy: 'Jane Johnson',
    hotlistLastUpdatedOn: '2026-02-05 02:40 PM',
  },
  {
    id: '3',
    clientId: '1003',
    core: 'No',
    lite: 'Yes',
    liteBlocking: 'No',
    protectBuy: 'Yes',
    hotlistService: 'Enabled',
    opServiceCode: 'OP-12',
    validationStatus: 'Valid',
    portfolioName: 'Gamma',
    hotlistLastUpdatedBy: 'Michael Brown',
    hotlistLastUpdatedOn: '2026-02-04 11:05 AM',
  },
];

export const FiHotlistCheckPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading, error } = useAppSelector((state) => state.fiHotlistCheck);
  const [mode, setMode] = useState<'single' | 'multiple' | 'date'>('single');
  const [clientId, setClientId] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [fileName, setFileName] = useState('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<{ clientId?: string; portfolioName?: string; date?: string; file?: string }>({});
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const columns = useMemo<GridColDef<HotlistRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'core', headerName: 'Core', width: 90 },
      { field: 'lite', headerName: 'Lite', width: 90 },
      { field: 'liteBlocking', headerName: 'Lite & Blocking', width: 140 },
      { field: 'protectBuy', headerName: 'Protect Buy', width: 120 },
      { field: 'hotlistService', headerName: 'Hotlist Service', width: 150 },
      { field: 'opServiceCode', headerName: 'OP Service Code', width: 150 },
      { field: 'validationStatus', headerName: 'Validation Status', width: 160 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 160 },
      { field: 'hotlistLastUpdatedBy', headerName: 'Hotlist Last Updated By', width: 190 },
      { field: 'hotlistLastUpdatedOn', headerName: 'Hotlist Last Updated On', width: 190 },
    ],
    []
  );

  const resetErrors = () => setErrors({});

  const handleSearchSingle = () => {
    const nextErrors: typeof errors = {};
    const hasClientId = clientId.trim().length > 0;
    const hasPortfolio = portfolioName.trim().length > 0;

    if (!hasClientId && !hasPortfolio) {
      nextErrors.clientId = 'Client ID or Portfolio Name is required';
      nextErrors.portfolioName = 'Client ID or Portfolio Name is required';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    dispatch(
      fetchFiHotlistSearch({
        clientId: hasClientId ? clientId.trim() : '',
        portfolioName: hasPortfolio ? portfolioName.trim() : '',
      })
    );
  };

  const handleSearchAll = () => {
    resetErrors();
    dispatch(fetchFiHotlistAll());
  };

  const handleSearchMultiple = () => {
    const nextErrors: typeof errors = {};
    if (!fileName) {
      nextErrors.file = 'Search By Client ID or Portfolio Name Details file is required';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    dispatch(setFiHotlistRecords(MOCK_ROWS));
  };

  const handleSearchByDate = () => {
    const nextErrors: typeof errors = {};
    const hasClientId = clientId.trim().length > 0;
    const hasPortfolio = portfolioName.trim().length > 0;

    if (!hasClientId && !hasPortfolio) {
      nextErrors.clientId = 'Client ID or Portfolio Name is required';
      nextErrors.portfolioName = 'Client ID or Portfolio Name is required';
    }

    if (!date) {
      nextErrors.date = 'Date is required';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    const formattedDate = date ? date.format('D-MMM-YYYY').toUpperCase() : '';
    dispatch(
      fetchFiHotlistSearch({
        clientId: hasClientId ? clientId.trim() : '',
        portfolioName: hasPortfolio ? portfolioName.trim() : '',
        searchDate: formattedDate,
      })
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        FI Hotlist Check
      </Typography>

      <RadioGroup
        row
        value={mode}
        onChange={(e) => {
          setMode(e.target.value as 'single' | 'multiple' | 'date');
          setClientId('');
          setPortfolioName('');
          setFileName('');
          setDate(null);
          resetErrors();
        }}
      >
        <FormControlLabel value="single" control={<Radio />} label="Search by Single FI" />
        <FormControlLabel value="multiple" control={<Radio />} label="Search by Multiple FI" />
        <FormControlLabel value="date" control={<Radio />} label="Search By Date" />
      </RadioGroup>

      {mode === 'single' && (
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              error={!!errors.clientId}
              helperText={errors.clientId}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              OR
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Portfolio Name"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              error={!!errors.portfolioName}
              helperText={errors.portfolioName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSearchSingle}>
                Search
              </Button>
              <Button variant="outlined" onClick={handleSearchAll}>
                Search All
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {mode === 'multiple' && (
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button variant="outlined" component="label">
                Search By Client ID or Portfolio Name Details
                <input
                  hidden
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setFileName(file?.name ?? '');
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
            {errors.file && (
              <Typography variant="caption" color="error">
                {errors.file}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button variant="contained" onClick={handleSearchMultiple}>
              Search
            </Button>
          </Grid>
        </Grid>
      )}

      {mode === 'date' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                error={!!errors.clientId}
                helperText={errors.clientId}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                OR
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Portfolio Name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                error={!!errors.portfolioName}
                helperText={errors.portfolioName}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <DatePicker
                label="Date"
                value={date}
                onChange={setDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.date,
                    helperText: errors.date,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button variant="contained" onClick={handleSearchByDate}>
                Search
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <DataGrid
          autoHeight
          rows={records}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          paginationMode="client"
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: (theme) => theme.palette.grey[300],
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              color: 'text.primary',
            },
          }}
        />
      </Box>
    </Box>
  );
};
