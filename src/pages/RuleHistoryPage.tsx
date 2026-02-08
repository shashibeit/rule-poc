import { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Alert,
  Button,
} from '@mui/material';
import { Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { GridColDef } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchRuleHistory, setRuleHistoryPagination } from '@/features/reports/ruleHistorySlice';
import { RuleHistoryRecord } from '@/types';

interface RuleHistoryHeaderProps {
  ruleName: string;
  runWindow: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  errors: {
    ruleName?: string;
    startDate?: string;
  };
  onRuleNameChange: (value: string) => void;
  onRunWindowChange: (value: string) => void;
  onStartDateChange: (value: Dayjs | null) => void;
  onEndDateChange: (value: Dayjs | null) => void;
  onApply: () => void;
  onClear: () => void;
}

const RuleHistoryHeader: FC<RuleHistoryHeaderProps> = ({
  ruleName,
  runWindow,
  startDate,
  endDate,
  errors,
  onRuleNameChange,
  onRunWindowChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Rule History
      </Typography>

      <Alert severity="warning" sx={{ mb: 2 }}>
        Window Timings Noon : 11:00 AM - 4:00 PM | Evening 4:01 PM - 11:50 PM
      </Alert>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={onStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  error: !!errors.startDate,
                  helperText: errors.startDate,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={onEndDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Run Window"
              value={runWindow}
              onChange={(e) => onRunWindowChange(e.target.value)}
            >
              <MenuItem value="Noon">Noon</MenuItem>
              <MenuItem value="Evening">Evening</MenuItem>
            </TextField>
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
              label="Search"
              value={ruleName}
              onChange={(e) => onRuleNameChange(e.target.value)}
              error={!!errors.ruleName}
              helperText={errors.ruleName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={onApply}>
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

const RuleHistoryGrid = withDataGrid<RuleHistoryHeaderProps>(RuleHistoryHeader);

export const RuleHistoryPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, total, loading, pagination } = useAppSelector((state) => state.ruleHistory);

  const [ruleName, setRuleName] = useState('');
  const [runWindow, setRunWindow] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<{
    ruleName?: string;
    startDate?: string;
  }>({});
  const [hasApplied, setHasApplied] = useState(false);

  const [applied, setApplied] = useState({
    ruleName: '',
    runWindow: '',
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
  });

  useEffect(() => {
    if (!hasApplied) {
      return;
    }

    dispatch(
      fetchRuleHistory({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ruleName: applied.ruleName,
        runWindow: applied.runWindow,
        startDate: applied.startDate ? applied.startDate.startOf('day').toISOString() : undefined,
        endDate: applied.endDate ? applied.endDate.endOf('day').toISOString() : undefined,
      })
    );
  }, [dispatch, pagination.page, pagination.pageSize, applied, hasApplied]);

  const columns = useMemo<GridColDef<RuleHistoryRecord>[]>(
    () => [
      { field: 'ruleCategory', headerName: 'Rule Category', flex: 1, minWidth: 180 },
      { field: 'ruleSet', headerName: 'Rule Set', flex: 1, minWidth: 160 },
      { field: 'ruleName', headerName: 'Rule Name', flex: 1, minWidth: 200 },
      { field: 'mode', headerName: 'Mode', width: 130 },
      { field: 'ruleIndicator', headerName: 'Rule Indicator', width: 150 },
      {
        field: 'createdAt',
        headerName: 'Created Time Stamp',
        width: 220,
        valueGetter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
      },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: hasApplied ? records : [],
    columns,
    rowCount: hasApplied ? total : 0,
    loading: hasApplied ? loading : false,
    page: pagination.page,
    pageSize: pagination.pageSize,
    onPageChange: (newPage) => dispatch(setRuleHistoryPagination({ page: newPage })),
    onPageSizeChange: (newPageSize) =>
      dispatch(setRuleHistoryPagination({ page: 0, pageSize: newPageSize })),
  };

  return (
    <RuleHistoryGrid
      {...props}
      ruleName={ruleName}
      runWindow={runWindow}
      startDate={startDate}
      endDate={endDate}
      errors={errors}
      onRuleNameChange={setRuleName}
      onRunWindowChange={setRunWindow}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onApply={() => {
        const nextErrors: {
          ruleName?: string;
          startDate?: string;
        } = {};

        const hasRuleName = ruleName.trim().length > 0;

        if (hasRuleName) {
          if (ruleName.trim().length > 50) {
            nextErrors.ruleName = 'Rule Name must be 50 characters or less';
          }
        } else if (!startDate) {
          nextErrors.startDate = 'Start Date is required';
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
          return;
        }

        setApplied({
          ruleName: ruleName.trim(),
          runWindow,
          startDate,
          endDate,
        });
        setHasApplied(true);
        dispatch(setRuleHistoryPagination({ page: 0 }));
      }}
      onClear={() => {
        setRuleName('');
        setRunWindow('');
        setStartDate(null);
        setEndDate(null);
        setErrors({});
        setApplied({
          ruleName: '',
          runWindow: '',
          startDate: null,
          endDate: null,
        });
        setHasApplied(false);
        dispatch(setRuleHistoryPagination({ page: 0 }));
      }}
    />
  );
};
