import { FC, useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';

const DEBIT_PROTECT_SERVICE_OPTIONS = [
  'Custom Alerting',
  'Guardian',
  'No Rules',
  'Not Enabled',
  'Profile MATURATION',
];

const CARD_HOLDER_SERVICES_OPTIONS = ['Disalbed', 'Enabled'];
const DIRECT_PROTECT_COMMUNICATE_OPTIONS = ['Disabled', 'Enabled'];
const DIRECT_PROTECT_COMPROMISE_MANAGER_OPTIONS = ['Disabled', 'Enabled'];
const STOP_PAY_OPTIONS = ['Enabled', 'Disabled'];

export const AddFiPage: FC = () => {
  const [clientId, setClientId] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [acro, setAcro] = useState('');
  const [salesforceFiName, setSalesforceFiName] = useState('');
  const [debitProtectService, setDebitProtectService] = useState('');
  const [cardHolderServices, setCardHolderServices] = useState('');
  const [directProtectCommunicate, setDirectProtectCommunicate] = useState('');
  const [directProtectCompromiseManager, setDirectProtectCompromiseManager] = useState('');
  const [stopPay, setStopPay] = useState('');
  const [serviceComments, setServiceComments] = useState('');

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validate = () => {
    const nextErrors: {[key: string]: string} = {};

    if (!clientId.trim()) nextErrors.clientId = 'Client ID is required';
    if (!portfolioName.trim()) nextErrors.portfolioName = 'Portfolio Name is required';
    if (!acro.trim()) nextErrors.acro = 'ACRO is required';
    if (!salesforceFiName.trim()) nextErrors.salesforceFiName = 'Salesforce FI Name is required';
    if (!debitProtectService) nextErrors.debitProtectService = 'Debit Protect Service is required';
    if (!cardHolderServices) nextErrors.cardHolderServices = 'Card Holder Services is required';
    if (!directProtectCommunicate) nextErrors.directProtectCommunicate = 'DirectProtect Communicate is required';
    if (!directProtectCompromiseManager) nextErrors.directProtectCompromiseManager = 'DirectProtect Compromise Manager is required';
    if (!stopPay) nextErrors.stopPay = 'Stop Pay is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
  };

  const handleClear = () => {
    setClientId('');
    setPortfolioName('');
    setAcro('');
    setSalesforceFiName('');
    setDebitProtectService('');
    setCardHolderServices('');
    setDirectProtectCommunicate('');
    setDirectProtectCompromiseManager('');
    setStopPay('');
    setServiceComments('');
    setErrors({});
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add FI
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Client ID *"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            error={!!errors.clientId}
            helperText={errors.clientId}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Portfolio Name *"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            error={!!errors.portfolioName}
            helperText={errors.portfolioName}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="ACRO *"
            value={acro}
            onChange={(e) => setAcro(e.target.value)}
            error={!!errors.acro}
            helperText={errors.acro}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Salesforce FI Name *"
            value={salesforceFiName}
            onChange={(e) => setSalesforceFiName(e.target.value)}
            error={!!errors.salesforceFiName}
            helperText={errors.salesforceFiName}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Debit Protect Service *"
            value={debitProtectService}
            onChange={(e) => setDebitProtectService(e.target.value)}
            error={!!errors.debitProtectService}
            helperText={errors.debitProtectService}
          >
            {DEBIT_PROTECT_SERVICE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Card Holder Services *"
            value={cardHolderServices}
            onChange={(e) => setCardHolderServices(e.target.value)}
            error={!!errors.cardHolderServices}
            helperText={errors.cardHolderServices}
          >
            {CARD_HOLDER_SERVICES_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="DirectProtect Communicate *"
            value={directProtectCommunicate}
            onChange={(e) => setDirectProtectCommunicate(e.target.value)}
            error={!!errors.directProtectCommunicate}
            helperText={errors.directProtectCommunicate}
          >
            {DIRECT_PROTECT_COMMUNICATE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="DirectProtect Compromise Manager *"
            value={directProtectCompromiseManager}
            onChange={(e) => setDirectProtectCompromiseManager(e.target.value)}
            error={!!errors.directProtectCompromiseManager}
            helperText={errors.directProtectCompromiseManager}
          >
            {DIRECT_PROTECT_COMPROMISE_MANAGER_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Stop Pay *"
            value={stopPay}
            onChange={(e) => setStopPay(e.target.value)}
            error={!!errors.stopPay}
            helperText={errors.stopPay}
          >
            {STOP_PAY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            label="DirectProtect Service Comments"
            value={serviceComments}
            onChange={(e) => {
              const next = e.target.value;
              if (next.length <= 400) {
                setServiceComments(next);
              }
            }}
            multiline
            minRows={3}
            helperText={`${serviceComments.length}/400`}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
