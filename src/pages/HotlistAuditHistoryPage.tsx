import { FC, useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchHotlistAuditLogs, HotlistAuditRecord } from '@/features/reports/hotlistAuditHistorySlice';

interface HotlistAuditHeaderProps {
  mode: 'fi' | 'emergency' | 'risky';
  fiHotlistName: string;
  emergencyHotlistName: string;
  riskyHotlistName: string;
  keyClientId: string;
  keyEmergencyRule: string;
  keyRuleName: string;
  portfolioName: string;
  userName: string;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  errors: {
    fiHotlistName?: string;
    emergencyHotlistName?: string;
    riskyHotlistName?: string;
    keyClientId?: string;
    keyEmergencyRule?: string;
    keyRuleName?: string;
  };
  onModeChange: (mode: 'fi' | 'emergency' | 'risky') => void;
  onFiHotlistNameChange: (value: string) => void;
  onEmergencyHotlistNameChange: (value: string) => void;
  onRiskyHotlistNameChange: (value: string) => void;
  onKeyClientIdChange: (value: string) => void;
  onKeyEmergencyRuleChange: (value: string) => void;
  onKeyRuleNameChange: (value: string) => void;
  onPortfolioNameChange: (value: string) => void;
  onUserNameChange: (value: string) => void;
  onFromDateChange: (value: Dayjs | null) => void;
  onToDateChange: (value: Dayjs | null) => void;
  onSearch: () => void;
  onClear: () => void;
}

const HotlistAuditHeader: FC<HotlistAuditHeaderProps> = ({
  mode,
  fiHotlistName,
  emergencyHotlistName,
  riskyHotlistName,
  keyClientId,
  keyEmergencyRule,
  keyRuleName,
  portfolioName,
  userName,
  fromDate,
  toDate,
  errors,
  onModeChange,
  onFiHotlistNameChange,
  onEmergencyHotlistNameChange,
  onRiskyHotlistNameChange,
  onKeyClientIdChange,
  onKeyEmergencyRuleChange,
  onKeyRuleNameChange,
  onPortfolioNameChange,
  onUserNameChange,
  onFromDateChange,
  onToDateChange,
  onSearch,
  onClear,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hotlist Audit History
      </Typography>

      <RadioGroup
        row
        value={mode}
        onChange={(e) => onModeChange(e.target.value as 'fi' | 'emergency' | 'risky')}
      >
        <FormControlLabel value="fi" control={<Radio />} label="FI Hotlist Audit" />
        <FormControlLabel value="emergency" control={<Radio />} label="Emergency Hotlist Audit" />
        <FormControlLabel value="risky" control={<Radio />} label="Risky Hotlist Audit" />
      </RadioGroup>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2} alignItems="center">
          {mode === 'fi' && (
            <>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Client Hotlist Name"
                  value={fiHotlistName}
                  onChange={(e) => onFiHotlistNameChange(e.target.value)}
                  error={!!errors.fiHotlistName}
                  helperText={errors.fiHotlistName}
                >
                  <MenuItem value="TGHL_CORE_FI">TGHL_CORE_FI</MenuItem>
                  <MenuItem value="TGHL_LITE_FI">TGHL_LITE_FI</MenuItem>
                  <MenuItem value="THGL_PROTECTBUY_FI">THGL_PROTECTBUY_FI</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Key (CLIENT ID)"
                  value={keyClientId}
                  onChange={(e) => onKeyClientIdChange(e.target.value)}
                  error={!!errors.keyClientId}
                  helperText={errors.keyClientId}
                />
              </Grid>
            </>
          )}

          {mode === 'emergency' && (
            <>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Emergency Hotlist Name"
                  value={emergencyHotlistName}
                  onChange={(e) => onEmergencyHotlistNameChange(e.target.value)}
                  error={!!errors.emergencyHotlistName}
                  helperText={errors.emergencyHotlistName}
                >
                  <MenuItem value="EMERGENCY_CORE">EMERGENCY_CORE</MenuItem>
                  <MenuItem value="EMERGENCY_LITE">EMERGENCY_LITE</MenuItem>
                  <MenuItem value="EMERGENCY_BLOCK">EMERGENCY_BLOCK</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Key (Emergency Rule)"
                  value={keyEmergencyRule}
                  onChange={(e) => onKeyEmergencyRuleChange(e.target.value)}
                  error={!!errors.keyEmergencyRule}
                  helperText={errors.keyEmergencyRule}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Key (CLIENT ID)"
                  value={keyClientId}
                  onChange={(e) => onKeyClientIdChange(e.target.value)}
                  error={!!errors.keyClientId}
                  helperText={errors.keyClientId}
                />
              </Grid>
            </>
          )}

          {mode === 'risky' && (
            <>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Risky Hotlist Name"
                  value={riskyHotlistName}
                  onChange={(e) => onRiskyHotlistNameChange(e.target.value)}
                  error={!!errors.riskyHotlistName}
                  helperText={errors.riskyHotlistName}
                >
                  <MenuItem value="RISKY_CORE">RISKY_CORE</MenuItem>
                  <MenuItem value="RISKY_LITE">RISKY_LITE</MenuItem>
                  <MenuItem value="RISKY_ALERT">RISKY_ALERT</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Key (Rule Name)"
                  value={keyRuleName}
                  onChange={(e) => onKeyRuleNameChange(e.target.value)}
                  error={!!errors.keyRuleName}
                  helperText={errors.keyRuleName}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Key (CLIENT ID)"
                  value={keyClientId}
                  onChange={(e) => onKeyClientIdChange(e.target.value)}
                  error={!!errors.keyClientId}
                  helperText={errors.keyClientId}
                />
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Portfolio Name"
              value={portfolioName}
              onChange={(e) => onPortfolioNameChange(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="User Name"
              value={userName}
              onChange={(e) => onUserNameChange(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={onFromDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={onToDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={onSearch}>
                Search
              </Button>
              <Button variant="outlined" onClick={onClear}>
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

const HotlistAuditGrid = withDataGrid<HotlistAuditHeaderProps>(HotlistAuditHeader);

export const HotlistAuditHistoryPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading, error } = useAppSelector((state) => state.hotlistAuditHistory);
  const [mode, setMode] = useState<'fi' | 'emergency' | 'risky'>('fi');
  const [fiHotlistName, setFiHotlistName] = useState('');
  const [emergencyHotlistName, setEmergencyHotlistName] = useState('');
  const [riskyHotlistName, setRiskyHotlistName] = useState('');
  const [keyClientId, setKeyClientId] = useState('');
  const [keyEmergencyRule, setKeyEmergencyRule] = useState('');
  const [keyRuleName, setKeyRuleName] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [userName, setUserName] = useState('');
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<{
    fiHotlistName?: string;
    emergencyHotlistName?: string;
    riskyHotlistName?: string;
    keyClientId?: string;
    keyEmergencyRule?: string;
    keyRuleName?: string;
  }>({});
  const [hasApplied, setHasApplied] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<HotlistAuditRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 160 },
      { field: 'hotlistName', headerName: 'Hotlist Name', width: 180 },
      { field: 'action', headerName: 'Action', width: 120 },
      { field: 'valueFrom', headerName: 'Value From (Key, Value, From Date, To Date, Status)', width: 340 },
      { field: 'valueTo', headerName: 'Value To (Key, Value, From Date, To Date, Status)', width: 340 },
      { field: 'changedByUser', headerName: 'Changed by User', width: 180 },
      { field: 'timeModified', headerName: 'Time Modified', width: 170 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: hasApplied ? records : [],
    columns,
    rowCount: hasApplied ? records.length : 0,
    loading,
    page,
    pageSize,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: (newPageSize) => {
      setPage(0);
      setPageSize(newPageSize);
    },
    clientSidePagination: true,
  };

  const handleSearch = () => {
    const nextErrors: typeof errors = {};

    if (mode === 'fi') {
      if (!fiHotlistName) {
        nextErrors.fiHotlistName = 'Client Hotlist Name is required';
      }
      if (!keyClientId.trim()) {
        nextErrors.keyClientId = 'Key (CLIENT ID) is required';
      }
    }

    if (mode === 'emergency') {
      if (!emergencyHotlistName) {
        nextErrors.emergencyHotlistName = 'Emergency Hotlist Name is required';
      }
      if (!keyEmergencyRule.trim()) {
        nextErrors.keyEmergencyRule = 'Key (Emergency Rule) is required';
      }
    }

    if (mode === 'risky') {
      if (!riskyHotlistName) {
        nextErrors.riskyHotlistName = 'Risky Hotlist Name is required';
      }
      if (!keyRuleName.trim()) {
        nextErrors.keyRuleName = 'Key (Rule Name) is required';
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const formattedFromDate = fromDate ? fromDate.format('D-MMM-YYYY').toUpperCase() : undefined;
    const formattedToDate = toDate ? toDate.format('D-MMM-YYYY').toUpperCase() : undefined;
    const trimmedUserName = userName.trim();
    const trimmedPortfolioName = portfolioName.trim();

    if (mode === 'fi') {
      dispatch(
        fetchHotlistAuditLogs({
          hotListEntityKeyName: keyClientId.trim(),
          hotListName: fiHotlistName,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          changedByUser: trimmedUserName || undefined,
          portFolioName: trimmedPortfolioName || undefined,
        })
      );
    }

    setHasApplied(true);
    setPage(0);
  };

  const handleClear = () => {
    setFiHotlistName('');
    setEmergencyHotlistName('');
    setRiskyHotlistName('');
    setKeyClientId('');
    setKeyEmergencyRule('');
    setKeyRuleName('');
    setPortfolioName('');
    setUserName('');
    setFromDate(null);
    setToDate(null);
    setErrors({});
    setHasApplied(false);
    setPage(0);
  };

  return (
    <HotlistAuditGrid
      {...props}
      mode={mode}
      fiHotlistName={fiHotlistName}
      emergencyHotlistName={emergencyHotlistName}
      riskyHotlistName={riskyHotlistName}
      keyClientId={keyClientId}
      keyEmergencyRule={keyEmergencyRule}
      keyRuleName={keyRuleName}
      portfolioName={portfolioName}
      userName={userName}
      fromDate={fromDate}
      toDate={toDate}
      errors={errors}
      onModeChange={(nextMode) => {
        setMode(nextMode);
        setErrors({});
        setHasApplied(false);
      }}
      onFiHotlistNameChange={setFiHotlistName}
      onEmergencyHotlistNameChange={setEmergencyHotlistName}
      onRiskyHotlistNameChange={setRiskyHotlistName}
      onKeyClientIdChange={setKeyClientId}
      onKeyEmergencyRuleChange={setKeyEmergencyRule}
      onKeyRuleNameChange={setKeyRuleName}
      onPortfolioNameChange={setPortfolioName}
      onUserNameChange={setUserName}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      onSearch={handleSearch}
      onClear={handleClear}
    />
  );
};
