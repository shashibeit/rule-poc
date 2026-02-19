import { FC, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearSearchFiError,
  clearSearchModifyFiMessage,
  SearchFiDetailsRecord,
  searchFiDetails,
  updateFiDetails,
} from '@/features/reports/searchModifyFiSlice';

interface SearchModifyFiHeaderProps {
  clientId: string;
  portfolioName: string;
  errors: { clientId?: string; portfolioName?: string };
  onClientIdChange: (value: string) => void;
  onPortfolioNameChange: (value: string) => void;
  onSearch: () => void;
  onSearchAll: () => void;
}

const SearchModifyFiHeader: FC<SearchModifyFiHeaderProps> = ({
  clientId,
  portfolioName,
  errors,
  onClientIdChange,
  onPortfolioNameChange,
  onSearch,
  onSearchAll,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Search/Modify FI
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Client ID"
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
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
            onChange={(e) => onPortfolioNameChange(e.target.value)}
            error={!!errors.portfolioName}
            helperText={errors.portfolioName}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={onSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={onSearchAll}>
              Search All
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const SearchModifyFiGrid = withDataGrid<SearchModifyFiHeaderProps>(SearchModifyFiHeader);

interface FiRecord {
  id: string;
  clientId: string;
  portfolioName: string;
  acro: string;
  fiName: string;
  debitProtectService: string;
  cardHolderServices: string;
  debitProtectCommunicate: string;
  debitProtectCompromiseManager: string;
  dcmTenantId: string;
  debitProtectCompromiseService: string;
  stopPay: string;
  serviceComments: string;
}

interface FiFormValues {
  portfolioName: string;
  acro: string;
  fiName: string;
  debitProtectService: string;
  cardHolderServices: string;
  debitProtectCommunicate: string;
  debitProtectCompromiseManager: string;
  dcmTenantId: string;
  debitProtectCompromiseService: string;
  stopPay: string;
  serviceComments: string;
}

const DEBIT_PROTECT_SERVICE_OPTIONS = [
  'LITE',
  'ALERTING',
  'DPAB',
  'Custom Alerting',
  'Guardian',
  'No Rules',
  'Not Enabled',
  'Profile MATURATION',
];
const CARD_HOLDER_SERVICES_OPTIONS = ['Disabled', 'Enabled'];
const DEBIT_PROTECT_COMMUNICATE_OPTIONS = ['Disabled', 'Enabled'];
const DEBIT_PROTECT_COMPROMISE_MANAGER_OPTIONS = ['Disabled', 'Enabled'];
const DEBIT_PROTECT_COMPROMISE_SERVICE_OPTIONS = ['Managed', 'Dedicated'];
const STOP_PAY_OPTIONS = ['Enabled', 'Disabled'];

const patternAcro = /^[a-zA-Z0-9]+$/;
const patternFiName = /^[a-zA-Z0-9\s&\-•.]+$/;
const strPatternAcro = /[^a-zA-Z0-9]/g;
const strPatternFiName = /[^a-zA-Z0-9\s&\-•.]/g;

const DEBIT_PROTECT_SERVICE_FLAG_MAP: Record<string, string> = {
  LITE: 'L',
  ALERTING: 'A',
  DPAB: 'D',
  'Custom Alerting': 'C',
  Guardian: 'G',
  'No Rules': 'X',
  'Not Enabled': 'N',
  'Profile MATURATION': 'P',
};

const DEBIT_PROTECT_COMPROMISE_SERVICE_FLAG_MAP: Record<string, string> = {
  Managed: 'M',
  Dedicated: 'D',
};

const toEnabledDisabledFlag = (value: string) => (value.toLowerCase().startsWith('en') ? 'E' : 'D');

const getUniqueInvalidChars = (value: string, invalidPattern: RegExp) =>
  Array.from(new Set(value.match(invalidPattern) ?? [])).join('');

const toFormValues = (row: FiRecord): FiFormValues => ({
  portfolioName: row.portfolioName,
  acro: row.acro,
  fiName: row.fiName,
  debitProtectService: row.debitProtectService,
  cardHolderServices: row.cardHolderServices,
  debitProtectCommunicate: row.debitProtectCommunicate,
  debitProtectCompromiseManager: row.debitProtectCompromiseManager,
  dcmTenantId: row.dcmTenantId,
  debitProtectCompromiseService: row.debitProtectCompromiseService,
  stopPay: row.stopPay,
  serviceComments: row.serviceComments,
});

const buildComparablePayload = (form: FiFormValues): Record<string, string> => {
  const ccmServiceFlag =
    form.debitProtectCompromiseManager === 'Enabled'
      ? DEBIT_PROTECT_COMPROMISE_SERVICE_FLAG_MAP[form.debitProtectCompromiseService]
      : undefined;
  const ccmTenantId = form.debitProtectCompromiseManager === 'Enabled' ? form.dcmTenantId.trim() : undefined;
  const dpsComments = form.serviceComments.trim();

  return {
    ACRO: form.acro.trim(),
    CCM_FLAG: toEnabledDisabledFlag(form.debitProtectCompromiseManager),
    ...(ccmServiceFlag ? { CCM_SERVICE_FLAG: ccmServiceFlag } : {}),
    ...(ccmTenantId ? { CCM_TENANT_ID: ccmTenantId } : {}),
    CCS_FLAG: toEnabledDisabledFlag(form.cardHolderServices),
    CHS_FLAG: toEnabledDisabledFlag(form.debitProtectCommunicate),
    ...(dpsComments ? { DPS_COMMENTS: dpsComments } : {}),
    DPS_FLAG: DEBIT_PROTECT_SERVICE_FLAG_MAP[form.debitProtectService] ?? '',
    'FI Name': form.fiName.trim(),
    'Portfolio Name': form.portfolioName.trim(),
    stopPayFlag: toEnabledDisabledFlag(form.stopPay),
  };
};

const dpsFlagToServiceLabel = (flag?: string) => {
  if (!flag) return 'Not Enabled';
  const upper = flag.toUpperCase();
  const mapping: Record<string, string> = {
    L: 'LITE',
    A: 'ALERTING',
    D: 'DPAB',
    C: 'Custom Alerting',
    G: 'Guardian',
    X: 'No Rules',
    N: 'Not Enabled',
    P: 'Profile MATURATION',
  };
  return mapping[upper] ?? 'Not Enabled';
};

const enabledFlagToLabel = (flag?: string) => (String(flag || '').toUpperCase() === 'E' ? 'Enabled' : 'Disabled');
const ccmServiceFlagToLabel = (flag?: string) => (String(flag || '').toUpperCase() === 'M' ? 'Managed' : 'Dedicated');

const mapSearchApiRecord = (row: SearchFiDetailsRecord, index: number): FiRecord => ({
  id: `${row.clientId || 'fi'}-${index + 1}`,
  clientId: row.clientId ?? '',
  portfolioName: row.portfolioName ?? '',
  acro: row.acro ?? '',
  fiName: row.fiName ?? '',
  debitProtectService: dpsFlagToServiceLabel(row.dpsFlag),
  cardHolderServices: enabledFlagToLabel(row.ccsFlag ?? row.cssFlag),
  debitProtectCommunicate: enabledFlagToLabel(row.chsFlag),
  debitProtectCompromiseManager: enabledFlagToLabel(row.ccmFlag),
  dcmTenantId: row.ccmTenantId ?? '',
  debitProtectCompromiseService: ccmServiceFlagToLabel(row.ccmServiceFlag),
  stopPay: enabledFlagToLabel(row.falcom),
  serviceComments: row.dpsComments ?? row.advice ?? '',
});

export const SearchModifyFiPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, searchLoading, searchError, updateLoading, updateError, updateSuccessMessage } = useAppSelector(
    (state) => state.searchModifyFi
  );

  const [clientId, setClientId] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [errors, setErrors] = useState<{ clientId?: string; portfolioName?: string }>({});
  const [rows, setRows] = useState<FiRecord[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState<FiRecord | null>(null);
  const [initialForm, setInitialForm] = useState<FiFormValues | null>(null);
  const [formValues, setFormValues] = useState<FiFormValues | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!updateSuccessMessage && !updateError) return;
    const timeoutId = window.setTimeout(() => {
      dispatch(clearSearchModifyFiMessage());
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [updateSuccessMessage, updateError, dispatch]);

  useEffect(() => {
    setRows(records.map(mapSearchApiRecord));
    setPage(0);
  }, [records]);

  const columns = useMemo<GridColDef<FiRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 180 },
      { field: 'acro', headerName: 'ACRO', width: 120 },
      { field: 'fiName', headerName: 'FI Name', width: 200 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: rows.slice(page * pageSize, page * pageSize + pageSize),
    columns,
    rowCount: rows.length,
    loading: searchLoading,
    page,
    pageSize,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: (newPageSize) => {
      setPage(0);
      setPageSize(newPageSize);
    },
    onRowClick: (row) => {
      const selected = row as FiRecord;
      const nextForm = toFormValues(selected);
      setSelectedRow(selected);
      setInitialForm(nextForm);
      setFormValues(nextForm);
      setFormErrors({});
      dispatch(clearSearchModifyFiMessage());
      dispatch(clearSearchFiError());
    },
  };

  const validateModal = () => {
    if (!formValues) return false;

    const nextErrors: Record<string, string> = {};
    if (!formValues.portfolioName.trim()) nextErrors.portfolioName = 'Portfolio Name is required';
    else if (!patternFiName.test(formValues.portfolioName.trim())) {
      const invalidChars = getUniqueInvalidChars(formValues.portfolioName, strPatternFiName);
      nextErrors.portfolioName = invalidChars
        ? `Portfolio Name has invalid character(s): ${invalidChars}`
        : 'Portfolio Name has invalid characters';
    }

    if (!formValues.acro.trim()) nextErrors.acro = 'ACRO is required';
    else if (!patternAcro.test(formValues.acro.trim())) {
      const invalidChars = getUniqueInvalidChars(formValues.acro, strPatternAcro);
      nextErrors.acro = invalidChars
        ? `ACRO allows only letters and numbers. Invalid character(s): ${invalidChars}`
        : 'ACRO allows only letters and numbers';
    }

    if (!formValues.fiName.trim()) nextErrors.fiName = 'FI Name is required';
    else if (!patternFiName.test(formValues.fiName.trim())) {
      const invalidChars = getUniqueInvalidChars(formValues.fiName, strPatternFiName);
      nextErrors.fiName = invalidChars
        ? `FI Name has invalid character(s): ${invalidChars}`
        : 'FI Name has invalid characters';
    }

    if (!formValues.debitProtectService) nextErrors.debitProtectService = 'Debit Protect Service is required';
    if (!formValues.cardHolderServices) nextErrors.cardHolderServices = 'Card Holder Services is required';
    if (!formValues.debitProtectCommunicate) nextErrors.debitProtectCommunicate = 'DebitProtect Communicate is required';
    if (!formValues.debitProtectCompromiseManager) {
      nextErrors.debitProtectCompromiseManager = 'DebitProtect Compromise Manager is required';
    }

    if (formValues.debitProtectCompromiseManager === 'Enabled') {
      if (!formValues.dcmTenantId.trim()) nextErrors.dcmTenantId = 'DCM Tenant ID is required when Manager is Enabled';
      if (!formValues.debitProtectCompromiseService) {
        nextErrors.debitProtectCompromiseService = 'DebitProtect Compromise Service is required when Manager is Enabled';
      }
    }

    if (!formValues.stopPay) nextErrors.stopPay = 'Stop Pay is required';

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleUpdateSubmit = async () => {
    if (!selectedRow || !initialForm || !formValues) return;

    dispatch(clearSearchModifyFiMessage());

    if (!validateModal()) {
      return;
    }

    const originalPayload = buildComparablePayload(initialForm);
    const currentPayload = buildComparablePayload(formValues);

    const changedEntries = Object.entries(currentPayload).filter(([key, value]) => originalPayload[key] !== value);
    if (changedEntries.length === 0) {
      dispatch(clearSearchModifyFiMessage());
      setFormErrors({ submit: 'No fields changed to update' });
      return;
    }

    const payload = {
      clientID: selectedRow.clientId,
      ...Object.fromEntries(changedEntries),
    };

    const result = await dispatch(updateFiDetails(payload));
    if (updateFiDetails.fulfilled.match(result)) {
      const updatedRow: FiRecord = {
        ...selectedRow,
        ...formValues,
      };

      setRows((prev) => prev.map((row) => (row.clientId === updatedRow.clientId ? updatedRow : row)));
      setSelectedRow(null);
      setInitialForm(null);
      setFormValues(null);
      setFormErrors({});
    }
  };

  return (
    <>
      {(updateSuccessMessage || updateError) && (
        <Box sx={{ mb: 2 }}>
          {updateSuccessMessage && <Alert severity="success">{updateSuccessMessage}</Alert>}
          {updateError && <Alert severity="error">{updateError}</Alert>}
        </Box>
      )}

      {searchError && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{searchError}</Alert>
        </Box>
      )}

      <SearchModifyFiGrid
        {...props}
        clientId={clientId}
        portfolioName={portfolioName}
        errors={errors}
        onClientIdChange={setClientId}
        onPortfolioNameChange={setPortfolioName}
        onSearch={() => {
          const trimmedClient = clientId.trim();
          const trimmedPortfolio = portfolioName.trim();
          const nextErrors: { clientId?: string; portfolioName?: string } = {};

          if (!trimmedClient && !trimmedPortfolio) {
            nextErrors.clientId = 'Client ID or Portfolio Name is required';
            nextErrors.portfolioName = 'Client ID or Portfolio Name is required';
          }

          setErrors(nextErrors);
          if (Object.keys(nextErrors).length > 0) {
            setRows([]);
            return;
          }

          dispatch(clearSearchFiError());
          dispatch(
            searchFiDetails({
              ...(trimmedClient ? { clientID: trimmedClient } : {}),
              ...(trimmedPortfolio ? { fiShortName: trimmedPortfolio } : {}),
            })
          );
        }}
        onSearchAll={() => {
          setErrors({});
          dispatch(clearSearchFiError());
          dispatch(searchFiDetails({ clientId: null, fiShortName: null }));
        }}
      />

      <Dialog open={!!selectedRow && !!formValues} onClose={() => setSelectedRow(null)} fullWidth maxWidth="md">
        <DialogTitle>Modify FI Details</DialogTitle>
        <DialogContent>
          {(updateError || updateSuccessMessage || formErrors.submit) && (
            <Box sx={{ mt: 1, mb: 2 }}>
              {updateError && <Alert severity="error">{updateError}</Alert>}
              {updateSuccessMessage && <Alert severity="success">{updateSuccessMessage}</Alert>}
              {formErrors.submit && <Alert severity="warning">{formErrors.submit}</Alert>}
            </Box>
          )}

          {selectedRow && formValues && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth size="small" label="Client ID" value={selectedRow.clientId} disabled />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Portfolio Name *"
                  value={formValues.portfolioName}
                  onChange={(e) => setFormValues({ ...formValues, portfolioName: e.target.value })}
                  error={!!formErrors.portfolioName}
                  helperText={formErrors.portfolioName}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="ACRO *"
                  value={formValues.acro}
                  onChange={(e) => setFormValues({ ...formValues, acro: e.target.value })}
                  error={!!formErrors.acro}
                  helperText={formErrors.acro}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="FI Name *"
                  value={formValues.fiName}
                  onChange={(e) => setFormValues({ ...formValues, fiName: e.target.value })}
                  error={!!formErrors.fiName}
                  helperText={formErrors.fiName}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Debit Protect Service *"
                  value={formValues.debitProtectService}
                  onChange={(e) => setFormValues({ ...formValues, debitProtectService: e.target.value })}
                  error={!!formErrors.debitProtectService}
                  helperText={formErrors.debitProtectService}
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
                  value={formValues.cardHolderServices}
                  onChange={(e) => setFormValues({ ...formValues, cardHolderServices: e.target.value })}
                  error={!!formErrors.cardHolderServices}
                  helperText={formErrors.cardHolderServices}
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
                  value={formValues.debitProtectCommunicate}
                  onChange={(e) => setFormValues({ ...formValues, debitProtectCommunicate: e.target.value })}
                  error={!!formErrors.debitProtectCommunicate}
                  helperText={formErrors.debitProtectCommunicate}
                >
                  {DEBIT_PROTECT_COMMUNICATE_OPTIONS.map((option) => (
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
                  value={formValues.debitProtectCompromiseManager}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setFormValues({
                      ...formValues,
                      debitProtectCompromiseManager: nextValue,
                      ...(nextValue !== 'Enabled' ? { dcmTenantId: '', debitProtectCompromiseService: '' } : {}),
                    });
                  }}
                  error={!!formErrors.debitProtectCompromiseManager}
                  helperText={formErrors.debitProtectCompromiseManager}
                >
                  {DEBIT_PROTECT_COMPROMISE_MANAGER_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {formValues.debitProtectCompromiseManager === 'Enabled' && (
                <>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="DCM Tenant ID *"
                      value={formValues.dcmTenantId}
                      onChange={(e) => {
                        const nextValue = e.target.value;
                        if (nextValue.length <= 5) {
                          setFormValues({ ...formValues, dcmTenantId: nextValue });
                        }
                      }}
                      error={!!formErrors.dcmTenantId}
                      helperText={formErrors.dcmTenantId}
                      slotProps={{ htmlInput: { maxLength: 5 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="DebitProtect Compromise Service *"
                      value={formValues.debitProtectCompromiseService}
                      onChange={(e) => setFormValues({ ...formValues, debitProtectCompromiseService: e.target.value })}
                      error={!!formErrors.debitProtectCompromiseService}
                      helperText={formErrors.debitProtectCompromiseService}
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
                  value={formValues.stopPay}
                  onChange={(e) => setFormValues({ ...formValues, stopPay: e.target.value })}
                  error={!!formErrors.stopPay}
                  helperText={formErrors.stopPay}
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
                  value={formValues.serviceComments}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    if (nextValue.length <= 400) {
                      setFormValues({ ...formValues, serviceComments: nextValue });
                    }
                  }}
                  multiline
                  minRows={3}
                  helperText={`${formValues.serviceComments.length}/400`}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedRow(null);
              setInitialForm(null);
              setFormValues(null);
              setFormErrors({});
              dispatch(clearSearchModifyFiMessage());
            }}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateSubmit} disabled={updateLoading || !formValues}>
            {updateLoading ? <CircularProgress size={18} color="inherit" /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
