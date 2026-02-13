import { FC, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, MenuItem, TextField, Typography, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { AppDataGrid } from '@/components/datagrid/AppDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchRuleCountAllData } from '@/features/reports/ruleCountSlice';
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

export const RuleCountPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading } = useAppSelector((state) => state.ruleCount);

  const [date, setDate] = useState<Dayjs | null>(null);
  const [runWindow, setRunWindow] = useState('');
  const [errors, setErrors] = useState<{ date?: string; runWindow?: string }>({});
  const [hasApplied, setHasApplied] = useState(false);
  const [applied, setApplied] = useState({ date: null as Dayjs | null, runWindow: '' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    if (!hasApplied) {
      return;
    }

    dispatch(
      fetchRuleCountAllData({
        ruleDateTo: applied.date ? applied.date.format('DD-MMM-YYYY').toUpperCase() : '',
        ruleTime: applied.runWindow,
      })
    );
  }, [dispatch, applied, hasApplied]);

  const columns = useMemo<GridColDef<RuleCountRecord>[]>(
    () => [
      { field: 'ruleCategoryName', headerName: 'Rule Category Name', flex: 1, minWidth: 200 },
      { field: 'ruleSetName', headerName: 'Rule Set Name', flex: 1, minWidth: 200 },
      { field: 'action', headerName: 'Action', width: 140 },
      { field: 'ruleCount', headerName: 'Count of Rules', width: 160 },
    ],
    []
  );

  return (
    <Box>
      <RuleCountHeader
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
          setPage(0);
        }}
        onClear={() => {
          setDate(null);
          setRunWindow('');
          setErrors({});
          setApplied({ date: null, runWindow: '' });
          setHasApplied(false);
          setPage(0);
        }}
      />
      
      <Box sx={{ mt: 2 }}>
        <AppDataGrid
          rows={hasApplied ? records : []}
          columns={columns}
          loading={hasApplied ? loading : false}
          clientSidePagination={true}
          searchFields={['ruleCategoryName', 'ruleSetName', 'action']}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Box>
    </Box>
  );
};
