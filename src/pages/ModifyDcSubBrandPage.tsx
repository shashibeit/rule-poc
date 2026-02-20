import { FC, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { DataGridProps, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearModifyDcSubBrand,
  clearModifyDcSubBrandSaveStatus,
  fetchModifyDcSubBrand,
  ModifyDcSubBrandRecord,
  updateBrandingDetails,
} from '@/features/reports/modifyDcSubBrandSlice';

interface ModifyDcSubBrandHeaderProps {
  clientId: string;
  error?: string;
  saveSuccessMessage?: string;
  saveErrorMessage?: string;
  saveLoading: boolean;
  showEditActions: boolean;
  onClientIdChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onAddRow: () => void;
  onSave: () => void;
}

const ModifyDcSubBrandHeader: FC<ModifyDcSubBrandHeaderProps> = ({
  clientId,
  error,
  saveSuccessMessage,
  saveErrorMessage,
  saveLoading,
  showEditActions,
  onClientIdChange,
  onSearch,
  onClear,
  onAddRow,
  onSave,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Modify DC Sub-Brand
      </Typography>

      {saveSuccessMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {saveSuccessMessage}
        </Alert>
      )}
      {saveErrorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveErrorMessage}
        </Alert>
      )}

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Client ID"
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={onSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={onClear}>
              Clear
            </Button>
            {showEditActions && (
              <>
                <Button variant="outlined" onClick={onAddRow}>
                  Add Row
                </Button>
                <Button variant="contained" onClick={onSave} disabled={saveLoading}>
                  Save
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const ModifyDcSubBrandGrid = withDataGrid<ModifyDcSubBrandHeaderProps>(ModifyDcSubBrandHeader);

export const ModifyDcSubBrandPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading, error, saveLoading, saveSuccessMessage, saveErrorMessage } = useAppSelector(
    (state) => state.modifyDcSubBrand
  );

  const [clientId, setClientId] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [localRows, setLocalRows] = useState<ModifyDcSubBrandRecord[]>([]);
  const [initialRowsMap, setInitialRowsMap] = useState<Record<string, ModifyDcSubBrandRecord>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setLocalRows(records);
    const nextMap: Record<string, ModifyDcSubBrandRecord> = {};
    records.forEach((row) => {
      if (row.id) {
        nextMap[String(row.id)] = row;
      }
    });
    setInitialRowsMap(nextMap);
    setRowErrors({});
  }, [records]);

  const columns = useMemo<GridColDef<ModifyDcSubBrandRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 140 },
      { field: 'fiName', headerName: 'FI Name', width: 170 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 180 },
      { field: 'brandName', headerName: 'SUB Brand', width: 170, editable: true },
      { field: 'bin', headerName: 'BIN', width: 140, editable: true },
      { field: 'urlAddress', headerName: 'PUSH-URL', width: 250 },
      { field: 'emailAddress', headerName: 'EMAIL', width: 230 },
    ],
    []
  );

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const row = newRow as ModifyDcSubBrandRecord;
    const nextErrors = { ...rowErrors };

    if (!row.brandName.trim()) {
      nextErrors[String(row.id)] = 'SUB Brand is required';
    } else if (!/^\d{3,12}$/.test(row.bin.trim())) {
      nextErrors[String(row.id)] = 'BIN must be 3 to 12 digits only';
    } else {
      delete nextErrors[String(row.id)];
    }

    setRowErrors(nextErrors);
    setLocalRows((prev) => prev.map((item) => (item.id === oldRow.id ? { ...item, ...row } : item)));
    return row;
  };

  const dataGridProps: Partial<DataGridProps> = {
    editMode: 'row',
    processRowUpdate,
    onProcessRowUpdateError: () => undefined,
  };

  const getChangedRows = () => {
    return localRows.filter((row) => {
      const original = row.id ? initialRowsMap[String(row.id)] : undefined;
      if (!original) {
        return true;
      }
      return row.bin !== original.bin || row.brandName !== original.brandName;
    });
  };

  const validateRowsForSave = () => {
    const changedRows = getChangedRows();
    const nextErrors: Record<string, string> = {};

    changedRows.forEach((row) => {
      if (!row.brandName.trim()) {
        nextErrors[String(row.id)] = 'SUB Brand is required';
      } else if (!/^\d{3,12}$/.test(row.bin.trim())) {
        nextErrors[String(row.id)] = 'BIN must be 3 to 12 digits only';
      }
    });

    setRowErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleConfirmSave = async () => {
    setIsConfirmOpen(false);
    dispatch(clearModifyDcSubBrandSaveStatus());

    const changedRows = getChangedRows();
    if (changedRows.length === 0) {
      setValidationError('No changes to save');
      return;
    }

    for (const row of changedRows) {
      const result = await dispatch(
        updateBrandingDetails({
          bin: row.bin.trim(),
          brandName: row.brandName.trim(),
          clientId: row.clientId,
          emailAddress: row.emailAddress,
          fiName: row.fiName,
          urlAddress: row.urlAddress,
        })
      );

      if (updateBrandingDetails.rejected.match(result)) {
        break;
      }
    }
  };

  const props: DataGridViewProps = {
    rows: localRows,
    columns,
    loading,
    page,
    pageSize,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: (newPageSize) => {
      setPage(0);
      setPageSize(newPageSize);
    },
    clientSidePagination: true,
    dataGridProps,
  };

  return (
    <>
      <ModifyDcSubBrandGrid
        {...props}
        clientId={clientId}
        error={validationError || error || undefined}
        saveSuccessMessage={saveSuccessMessage || undefined}
        saveErrorMessage={saveErrorMessage || undefined}
        saveLoading={saveLoading}
        showEditActions={localRows.length > 0}
        onClientIdChange={(value) => {
          if (value === '' || /^[0-9]+$/.test(value)) {
            setClientId(value);
          }
        }}
        onSearch={() => {
          const trimmed = clientId.trim();
          if (!trimmed) {
            setValidationError('Client ID is required');
            return;
          }

          setValidationError(undefined);
          setPage(0);
          dispatch(clearModifyDcSubBrandSaveStatus());
          dispatch(fetchModifyDcSubBrand({ clientId: trimmed }));
        }}
        onClear={() => {
          setClientId('');
          setValidationError(undefined);
          setPage(0);
          dispatch(clearModifyDcSubBrand());
        }}
        onAddRow={() => {
          const firstRow = localRows[0];
          if (!firstRow) {
            setValidationError('Search by Client ID before adding a row');
            return;
          }

          const newId = `new-${Date.now()}`;
          setLocalRows((prev) => [
            ...prev,
            {
              id: newId,
              clientId: firstRow.clientId,
              fiName: firstRow.fiName,
              portfolioName: firstRow.portfolioName,
              brandName: '',
              bin: '',
              urlAddress: firstRow.urlAddress,
              emailAddress: firstRow.emailAddress,
            },
          ]);
          setValidationError(undefined);
        }}
        onSave={() => {
          setValidationError(undefined);
          dispatch(clearModifyDcSubBrandSaveStatus());

          if (!validateRowsForSave()) {
            setValidationError('Please fix row validation errors before saving');
            return;
          }

          const changedRows = getChangedRows();
          if (changedRows.length === 0) {
            setValidationError('No changes to save');
            return;
          }

          setIsConfirmOpen(true);
        }}
      />

      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save the branding detail changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmSave} disabled={saveLoading}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {Object.keys(rowErrors).length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{Object.values(rowErrors).slice(0, 1)[0]}</Alert>
        </Box>
      )}
    </>
  );
};
