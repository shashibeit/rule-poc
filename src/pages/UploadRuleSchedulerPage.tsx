import { FC, useState } from 'react';
import { Box, Button, Typography, Alert, Grid } from '@mui/material';
import { useExcelParser } from '@/hooks/useExcelParser';

const REQUIRED_COLUMNS = ['Rule Name', 'Rule Mode', 'Run Window'];

export const UploadRuleSchedulerPage: FC = () => {
  const { parsing, parsed, errors, errorMessage, parseFile, reset } = useExcelParser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    await parseFile(selectedFile, {
      requiredColumns: REQUIRED_COLUMNS,
      customValidators: {
        'Rule Name': (value) => (String(value ?? '').trim() ? null : 'Rule Name cannot be empty'),
        'Rule Mode': (value) => {
          const normalized = String(value ?? '').trim().toUpperCase();
          const allowed = ['ENABLED', 'DISABLED', 'MONITOR'];
          return allowed.includes(normalized)
            ? null
            : `Rule Mode must be one of: ${allowed.join(', ')}`;
        },
        'Run Window': (value) => (String(value ?? '').trim() ? null : 'Run Window cannot be empty'),
      },
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Rule Scheduler
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Upload a CSV file exported from Excel (.csv). Required columns: Rule Name, Rule Mode, Run Window.
      </Alert>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {!errorMessage && errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Found {errors.length} validation issue(s). Showing first 5: {' '}
          {errors
            .slice(0, 5)
            .map((error) => `Row ${error.rowNumber}, ${error.column}: ${error.message}`)
            .join(' | ')}
        </Alert>
      )}

      {!errorMessage && errors.length === 0 && parsed && (
        <Alert severity="success" sx={{ mb: 2 }}>
          File parsed successfully. Sheet: {parsed.sheetName}, Rows: {parsed.rows.length}, Columns: {parsed.headers.length}
        </Alert>
      )}

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button variant="outlined" component="label">
              Choose File
              <input
                hidden
                type="file"
                accept=".csv"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedFile(file);
                  setFileName(file?.name ?? '');
                  reset();
                  event.target.value = '';
                }}
              />
            </Button>
            <Button variant="contained" disabled={!fileName || parsing} onClick={handleUpload}>
              Upload
            </Button>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {fileName && (
            <Typography variant="body2" color="text.secondary">
              {fileName}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
