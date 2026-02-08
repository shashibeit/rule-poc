import { FC, useState } from 'react';
import { Box, Button, Grid, Typography, Alert } from '@mui/material';

export const UploadRuleSchedulerPage: FC = () => {
  const [fileName, setFileName] = useState('');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Rule Scheduler
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Upload the rule scheduler file to proceed.
      </Alert>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button variant="outlined" component="label">
              Choose File
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
            <Button variant="contained" disabled={!fileName}>
              Upload
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
