import { FC, useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, TextField, Typography, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearAddFiMessage, submitAddFiDetails } from '@/features/reports/addFiSlice';

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
const DEBIT_PROTECT_COMPROMISE_SERVICE_OPTIONS = ['Managed', 'Dedicated'];
const STOP_PAY_OPTIONS = ['Enabled', 'Disabled'];

const patternClientId = /^[0-9]+$/;
const patternAcro = /^[a-zA-Z0-9]+$/;
const patternFiName = /^[a-zA-Z0-9\s&\-•.]+$/;
const strPatternClientId = /[^0-9]/g;
const strPatternAcro = /[^a-zA-Z0-9]/g;
const strPatternFiName = /[^a-zA-Z0-9\s&\-•.]/g;

const DEBIT_PROTECT_COMPROMISE_SERVICE_FLAG_MAP: Record<string, string> = {
  Managed: 'M',
  Dedicated: 'D',
};

const getUniqueInvalidChars = (value: string, invalidPattern: RegExp) =>
  Array.from(new Set(value.match(invalidPattern) ?? [])).join('');

const toEnabledDisabledFlag = (value: string) => (value.toLowerCase().startsWith('en') ? 'E' : 'D');

type FieldName =
  | 'clientId'
  | 'portfolioName'
  | 'acro'
  | 'salesforceFiName'
  | 'debitProtectService'
  | 'cardHolderServices'
  | 'directProtectCommunicate'
  | 'directProtectCompromiseManager'
  | 'dcmTenantId'
  | 'debitProtectCompromiseService'
  | 'stopPay';

interface AddFiFormValues {
  clientId: string;
  portfolioName: string;
  acro: string;
  salesforceFiName: string;
  debitProtectService: string;
  cardHolderServices: string;
  directProtectCommunicate: string;
  directProtectCompromiseManager: string;
  dcmTenantId: string;
  debitProtectCompromiseService: string;
  stopPay: string;
}

export const AddFiPage: FC = () => {
  const [clientId, setClientId] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [acro, setAcro] = useState('');
  const [salesforceFiName, setSalesforceFiName] = useState('');
  const [debitProtectService, setDebitProtectService] = useState('');
  const [cardHolderServices, setCardHolderServices] = useState('');
  const [directProtectCommunicate, setDirectProtectCommunicate] = useState('');
  const [directProtectCompromiseManager, setDirectProtectCompromiseManager] = useState('');
  const [dcmTenantId, setDcmTenantId] = useState('');
  const [debitProtectCompromiseService, setDebitProtectCompromiseService] = useState('');
  const [stopPay, setStopPay] = useState('');
  const [serviceComments, setServiceComments] = useState('');

  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector((state) => state.addFi);
  const apiMessage = successMessage
    ? { severity: 'success' as const, text: successMessage }
    : error
      ? { severity: 'error' as const, text: error }
      : null;

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});

  useEffect(() => {
    if (!apiMessage) return;

    const timeoutId = window.setTimeout(() => {
      dispatch(clearAddFiMessage());
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [apiMessage, dispatch]);

  const getValues = (overrides: Partial<AddFiFormValues> = {}): AddFiFormValues => ({
    clientId,
    portfolioName,
    acro,
    salesforceFiName,
    debitProtectService,
    cardHolderServices,
    directProtectCommunicate,
    directProtectCompromiseManager,
    dcmTenantId,
    debitProtectCompromiseService,
    stopPay,
    ...overrides,
  });

  const getFieldError = (field: FieldName, values: AddFiFormValues): string | undefined => {
    if (field === 'clientId') {
      if (!values.clientId.trim()) return 'Client ID is required';
      if (!patternClientId.test(values.clientId.trim())) {
        const invalidChars = getUniqueInvalidChars(values.clientId, strPatternClientId);
        return invalidChars
          ? `Client ID allows only digits. Invalid character(s): ${invalidChars}`
          : 'Client ID allows only digits';
      }
      return undefined;
    }

    if (field === 'portfolioName') {
      if (!values.portfolioName.trim()) return 'Portfolio Name is required';
      if (!patternFiName.test(values.portfolioName.trim())) {
        const invalidChars = getUniqueInvalidChars(values.portfolioName, strPatternFiName);
        return invalidChars
          ? `Portfolio Name has invalid character(s): ${invalidChars}`
          : 'Portfolio Name has invalid characters';
      }
      return undefined;
    }

    if (field === 'acro') {
      if (!values.acro.trim()) return 'ACRO is required';
      if (!patternAcro.test(values.acro.trim())) {
        const invalidChars = getUniqueInvalidChars(values.acro, strPatternAcro);
        return invalidChars
          ? `ACRO allows only letters and numbers. Invalid character(s): ${invalidChars}`
          : 'ACRO allows only letters and numbers';
      }
      return undefined;
    }

    if (field === 'salesforceFiName') {
      if (!values.salesforceFiName.trim()) return 'Salesforce FI Name is required';
      if (!patternFiName.test(values.salesforceFiName.trim())) {
        const invalidChars = getUniqueInvalidChars(values.salesforceFiName, strPatternFiName);
        return invalidChars
          ? `FI Name has invalid character(s): ${invalidChars}`
          : 'FI Name has invalid characters';
      }
      return undefined;
    }

    if (field === 'debitProtectService' && !values.debitProtectService) return 'Debit Protect Service is required';
    if (field === 'cardHolderServices' && !values.cardHolderServices) return 'Card Holder Services is required';
    if (field === 'directProtectCommunicate' && !values.directProtectCommunicate) return 'DebitProtect Communicate is required';
    if (field === 'directProtectCompromiseManager' && !values.directProtectCompromiseManager) return 'DebitProtect Compromise Manager is required';

    if (field === 'dcmTenantId' && values.directProtectCompromiseManager === 'Enabled') {
      if (!values.dcmTenantId.trim()) return 'DCM Tenant ID is required when Manager is Enabled';
      if (values.dcmTenantId.trim().length > 5) return 'DCM Tenant ID must be maximum 5 characters';
    }

    if (
      field === 'debitProtectCompromiseService' &&
      values.directProtectCompromiseManager === 'Enabled' &&
      !values.debitProtectCompromiseService
    ) {
      return 'DebitProtect Compromise Service is required when Manager is Enabled';
    }

    if (field === 'stopPay' && !values.stopPay) return 'Stop Pay is required';

    return undefined;
  };

  const setFieldError = (field: FieldName, error?: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const validateTouchedField = (field: FieldName, overrides: Partial<AddFiFormValues> = {}) => {
    if (!touched[field] && !errors[field]) return;
    const values = getValues(overrides);
    setFieldError(field, getFieldError(field, values));
  };

  const markTouchedAndValidate = (field: FieldName, overrides: Partial<AddFiFormValues> = {}) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const values = getValues(overrides);
    setFieldError(field, getFieldError(field, values));
  };

  const validate = () => {
    const values = getValues();
    const fields: FieldName[] = [
      'clientId',
      'portfolioName',
      'acro',
      'salesforceFiName',
      'debitProtectService',
      'cardHolderServices',
      'directProtectCommunicate',
      'directProtectCompromiseManager',
      'dcmTenantId',
      'debitProtectCompromiseService',
      'stopPay',
    ];

    const nextErrors: {[key: string]: string} = {};
    fields.forEach((field) => {
      const fieldError = getFieldError(field, values);
      if (fieldError) {
        nextErrors[field] = fieldError;
      }
    });

    setTouched({
      clientId: true,
      portfolioName: true,
      acro: true,
      salesforceFiName: true,
      debitProtectService: true,
      cardHolderServices: true,
      directProtectCommunicate: true,
      directProtectCompromiseManager: true,
      dcmTenantId: true,
      debitProtectCompromiseService: true,
      stopPay: true,
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    dispatch(clearAddFiMessage());

    if (!validate()) {
      return;
    }

    const ccmServiceFlag =
      directProtectCompromiseManager === 'Enabled'
        ? DEBIT_PROTECT_COMPROMISE_SERVICE_FLAG_MAP[debitProtectCompromiseService]
        : undefined;
    const ccmTenantId = directProtectCompromiseManager === 'Enabled' ? dcmTenantId.trim() : undefined;

    const payload = {
      ACRO: acro.trim(),
      CCM_FLAG: toEnabledDisabledFlag(directProtectCompromiseManager),
      ...(ccmServiceFlag ? { CCM_SERVICE_FLAG: ccmServiceFlag } : {}),
      ...(ccmTenantId ? { CCM_TENANT_ID: ccmTenantId } : {}),
      CCS_FLAG: toEnabledDisabledFlag(cardHolderServices),
      CHS_FLAG: toEnabledDisabledFlag(directProtectCommunicate),
      ClientID: Number(clientId.trim()),
      DPS_COMMENTS: serviceComments.trim(),
      DPS_FLAG: 'N',
      'FI Name': salesforceFiName.trim(),
      'Portfolio Name': portfolioName.trim(),
      stopPayFlag: toEnabledDisabledFlag(stopPay),
    };

    const result = await dispatch(submitAddFiDetails(payload));
    if (submitAddFiDetails.fulfilled.match(result)) {
      handleClear(false);
    }
  };

  const handleClear = (clearMessage = true) => {
    setClientId('');
    setPortfolioName('');
    setAcro('');
    setSalesforceFiName('');
    setDebitProtectService('');
    setCardHolderServices('');
    setDirectProtectCommunicate('');
    setDirectProtectCompromiseManager('');
    setDcmTenantId('');
    setDebitProtectCompromiseService('');
    setStopPay('');
    setServiceComments('');
    setErrors({});
    setTouched({});
    if (clearMessage) {
      dispatch(clearAddFiMessage());
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add FI
      </Typography>

      {apiMessage && (
        <Box sx={{ mb: 2 }}>
          <Alert severity={apiMessage.severity}>{apiMessage.text}</Alert>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Client ID *"
            value={clientId}
            onChange={(e) => {
              const nextValue = e.target.value;
              setClientId(nextValue);
              validateTouchedField('clientId', { clientId: nextValue });
            }}
            onBlur={() => markTouchedAndValidate('clientId')}
            error={!!errors.clientId}
            helperText={errors.clientId}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Portfolio Name *"
            value={portfolioName}
            onChange={(e) => {
              const nextValue = e.target.value;
              setPortfolioName(nextValue);
              validateTouchedField('portfolioName', { portfolioName: nextValue });
            }}
            onBlur={() => markTouchedAndValidate('portfolioName')}
            error={!!errors.portfolioName}
            helperText={errors.portfolioName}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="ACRO *"
            value={acro}
            onChange={(e) => {
              const nextValue = e.target.value;
              setAcro(nextValue);
              validateTouchedField('acro', { acro: nextValue });
            }}
            onBlur={() => markTouchedAndValidate('acro')}
            error={!!errors.acro}
            helperText={errors.acro}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Salesforce FI Name *"
            value={salesforceFiName}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSalesforceFiName(nextValue);
              validateTouchedField('salesforceFiName', { salesforceFiName: nextValue });
            }}
            onBlur={() => markTouchedAndValidate('salesforceFiName')}
            error={!!errors.salesforceFiName}
            helperText={errors.salesforceFiName}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Debit Protect Service *"
            value={debitProtectService}
            onChange={(e) => {
              const nextValue = e.target.value;
              setDebitProtectService(nextValue);
              validateTouchedField('debitProtectService', { debitProtectService: nextValue });
            }}
            onBlur={() => markTouchedAndValidate('debitProtectService')}
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
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Card Holder Services *"
            value={cardHolderServices}
            onChange={(e) => {
              const nextValue = e.target.value;
              setCardHolderServices(nextValue);
              validateTouchedField('cardHolderServices', { cardHolderServices: nextValue });
            }}
            onBlur={() => markTouchedAndValidate('cardHolderServices')}
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
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="DebitProtect Communicate *"
            value={directProtectCommunicate}
            onChange={(e) => {
              const nextValue = e.target.value;
              setDirectProtectCommunicate(nextValue);
              validateTouchedField('directProtectCommunicate', { directProtectCommunicate: nextValue });
            }}
            onBlur={() => markTouchedAndValidate('directProtectCommunicate')}
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
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="DebitProtect Compromise Manager *"
            value={directProtectCompromiseManager}
            onChange={(e) => {
              const nextValue = e.target.value;
              setDirectProtectCompromiseManager(nextValue);

              validateTouchedField('directProtectCompromiseManager', {
                directProtectCompromiseManager: nextValue,
              });

              if (nextValue !== 'Enabled') {
                setDcmTenantId('');
                setDebitProtectCompromiseService('');
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.dcmTenantId;
                  delete next.debitProtectCompromiseService;
                  return next;
                });
                setTouched((prev) => ({
                  ...prev,
                  dcmTenantId: false,
                  debitProtectCompromiseService: false,
                }));
              }
            }}
            onBlur={() => markTouchedAndValidate('directProtectCompromiseManager')}
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
        {directProtectCompromiseManager === 'Enabled' && (
          <>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="DCM Tenant ID *"
                value={dcmTenantId}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next.length <= 5) {
                    setDcmTenantId(next);
                    validateTouchedField('dcmTenantId', { dcmTenantId: next });
                  }
                }}
                onBlur={() => markTouchedAndValidate('dcmTenantId')}
                error={!!errors.dcmTenantId}
                helperText={errors.dcmTenantId}
                slotProps={{ htmlInput: { maxLength: 5 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="DebitProtect Compromise Service *"
                value={debitProtectCompromiseService}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setDebitProtectCompromiseService(nextValue);
                  validateTouchedField('debitProtectCompromiseService', {
                    debitProtectCompromiseService: nextValue,
                  });
                }}
                onBlur={() => markTouchedAndValidate('debitProtectCompromiseService')}
                error={!!errors.debitProtectCompromiseService}
                helperText={errors.debitProtectCompromiseService}
              >
                {DEBIT_PROTECT_COMPROMISE_SERVICE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </>
        )}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Stop Pay *"
            value={stopPay}
            onChange={(e) => {
              const nextValue = e.target.value;
              setStopPay(nextValue);
              validateTouchedField('stopPay', { stopPay: nextValue });
            }}
            onBlur={() => markTouchedAndValidate('stopPay')}
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
        <Grid size={12}>
          <TextField
            fullWidth
            size="small"
            label="DebitProtect Service Comments"
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
        <Grid size={12}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={18} color="inherit" /> : 'Submit'}
            </Button>
            <Button variant="outlined" onClick={() => handleClear()} disabled={loading}>
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
