import { FC, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, MenuItem, TextField, Typography, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchRuleCount, setRuleCountPagination } from '@/features/reports/ruleCountSlice';
import { RuleCountRecord } from '@/types';

interface RuleCountHeaderProps {
  date: Dayjs | null;
  runWindow: string;
  errors: {
    date?: string;
    runWindow?: string;
  };
  onDateChange: (value: Dayjs | null) => void;
  onRunWindowChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const RuleCountHeader: FC<RuleCountHeaderProps> = ({
  date,
  runWindow,
  errors,
  onDateChange,
  onRunWindowChange,
  onSearch,
  onClear,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Rule Count
      </Typography>

      <Alert severity="warning" sx={{ mb: 2 }}>
        Window Timings Noon : 11:00 AM - 4:00 PM | Evening 4:01 PM - 11:50 PM | Emergency 12:00 AM - 10:59 AM
      </Alert>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <DatePicker
              label="Date"
              value={date}
              onChange={onDateChange}
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
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Run Window"
              value={runWindow}
              onChange={(e) => onRunWindowChange(e.target.value)}
              error={!!errors.runWindow}
              helperText={errors.runWindow}
            >
              <MenuItem value="Noon">Noon</MenuItem>
              <MenuItem value="Evening">Evening</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
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

const RuleCountGrid = withDataGrid<RuleCountHeaderProps>(RuleCountHeader);

export const RuleCountPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, total, loading, pagination } = useAppSelector((state) => state.ruleCount);

  const [date, setDate] = useState<Dayjs | null>(null);
  const [runWindow, setRunWindow] = useState('');
  const [errors, setErrors] = useState<{ date?: string; runWindow?: string }>({});
  const [hasApplied, setHasApplied] = useState(false);
  const [applied, setApplied] = useState({ date: null as Dayjs | null, runWindow: '' });

  useEffect(() => {
    if (!hasApplied) {
      return;
    }

    dispatch(
      fetchRuleCount({
        page: pagination.page,
        pageSize: pagination.pageSize,
        runWindow: applied.runWindow,
        date: applied.date ? applied.date.format('YYYY-MM-DD') : '',
      })
    );
  }, [dispatch, pagination.page, pagination.pageSize, applied, hasApplied]);

  const columns = useMemo<GridColDef<RuleCountRecord>[]>(
    () => [
      { field: 'ruleCategoryName', headerName: 'Rule Category Name', flex: 1, minWidth: 200 },
      { field: 'ruleSetName', headerName: 'Rule Set Name', flex: 1, minWidth: 200 },
      { field: 'action', headerName: 'Action', width: 140 },
      { field: 'ruleCount', headerName: 'Count of Rules', width: 160 },
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
    onPageChange: (newPage) => dispatch(setRuleCountPagination({ page: newPage })),
    onPageSizeChange: (newPageSize) =>
      dispatch(setRuleCountPagination({ page: 0, pageSize: newPageSize })),
  };

  return (
    <RuleCountGrid
      {...props}
      date={date}
      runWindow={runWindow}
      errors={errors}
      onDateChange={setDate}
      onRunWindowChange={setRunWindow}
      onSearch={() => {
        const nextErrors: { date?: string; runWindow?: string } = {};

        if (!date) {
          nextErrors.date = 'Date is required';
        }
        if (!runWindow) {
          nextErrors.runWindow = 'Run Window is required';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
          return;
        }

        setApplied({ date, runWindow });
        setHasApplied(true);
        dispatch(setRuleCountPagination({ page: 0 }));
      }}
      onClear={() => {
        setDate(null);
        setRunWindow('');
        setErrors({});
        setApplied({ date: null, runWindow: '' });
        setHasApplied(false);
        dispatch(setRuleCountPagination({ page: 0 }));
      }}
    />
  );
};
