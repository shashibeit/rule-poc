import { FC, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearFiBoardingMessages,
  fetchNotBoardedFiDetails,
  FiOnboardingEmailPayload,
  NotBoardedFiRecord,
  sendFiOnboardingEmail,
} from '@/features/reports/fiBoardingSlice';

const FiBoardingHeader: FC<{ showSendButton: boolean; sending: boolean; onSend: () => void }> = ({
  showSendButton,
  sending,
  onSend,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        FI Boarding
      </Typography>
      {showSendButton && (
        <Button variant="contained" onClick={onSend} disabled={sending}>
          Send FI ONBOARDING EMAIL
        </Button>
      )}
    </Box>
  );
};

const FiBoardingGrid = withDataGrid<{ showSendButton: boolean; sending: boolean; onSend: () => void }>(FiBoardingHeader);

const toDpsCode = (dpsDescription: string) => {
  const normalized = dpsDescription.trim().toLowerCase();
  if (normalized === 'lite') return 'L';
  if (normalized === 'alerting') return 'A';
  if (normalized === 'dpab') return 'D';
  return 'L';
};

export const FiBoardingPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading, error, sending, sendSuccessMessage, sendErrorMessage } = useAppSelector(
    (state) => state.fiBoarding
  );

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set<GridRowId>(),
  });
  const [localSelectionError, setLocalSelectionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchNotBoardedFiDetails());
  }, [dispatch]);

  useEffect(() => {
    if (!sendSuccessMessage && !sendErrorMessage) return;

    const timeoutId = window.setTimeout(() => {
      dispatch(clearFiBoardingMessages());
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [sendSuccessMessage, sendErrorMessage, dispatch]);

  const columns = useMemo<GridColDef<NotBoardedFiRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 140 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 190 },
      { field: 'fiName', headerName: 'FI Name', width: 220 },
      { field: 'dpsDescription', headerName: 'DPS Description', width: 170 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: records,
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
    dataGridProps: {
      checkboxSelection: true,
      rowSelectionModel: selectedRowIds,
      onRowSelectionModelChange: (selection) => {
        setSelectedRowIds(selection);
        setLocalSelectionError(null);
      },
    },
  };

  const handleSend = async () => {
    dispatch(clearFiBoardingMessages());
    setLocalSelectionError(null);

    const selectedRows = records.filter((row: NotBoardedFiRecord) => {
      if (!row.id) {
        return false;
      }

      const rowId = String(row.id);
      if (selectedRowIds.type === 'include') {
        return selectedRowIds.ids.has(rowId);
      }

      return !selectedRowIds.ids.has(rowId);
    });

    if (selectedRows.length === 0) {
      setLocalSelectionError('Please select at least one FI row');
      return;
    }

    const payload: FiOnboardingEmailPayload[] = selectedRows.map((row: NotBoardedFiRecord) => ({
      acro: null,
      advice: null,
      ccmFlag: null,
      cmLastUpdatedDate: null,
      cmLastUpdatedUid: null,
      ccmServiceFlag: null,
      ccsFlag: null,
      ccsLastUpdatedDate: null,
      ccsLastUpdatedUid: null,
      chsFlag: null,
      chsLastUpdatedDate: null,
      chsLastUpdatedUid: null,
      clientId: row.clientId,
      cpmTenantId: null,
      dpsCode: toDpsCode(row.dpsDescription),
      dpsComment: null,
      dpsDescription: row.dpsDescription,
      dpsFlag: null,
      dpsLastUpdatedDate: null,
      dpsLastUpdatedUid: null,
      falcom: null,
      fiChecked: true,
      filastUpdatedDate: null,
      filastUpdatedUid: null,
      FiName: row.fiName,
      portfolioName: row.portfolioName,
      rcdDelValue: null,
      stopPayFlag: null,
      stopPayLastUpdatedDate: null,
      stopPayLastUpdatedUid: null,
      updateTimestamp: null,
      updateUid: null,
    }));

    await dispatch(sendFiOnboardingEmail(payload));
  };

  return (
    <>
      {(error || sendSuccessMessage || sendErrorMessage || localSelectionError) && (
        <Box sx={{ mb: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {sendSuccessMessage && <Alert severity="success">{sendSuccessMessage}</Alert>}
          {sendErrorMessage && <Alert severity="error">{sendErrorMessage}</Alert>}
          {localSelectionError && <Alert severity="warning">{localSelectionError}</Alert>}
        </Box>
      )}

      <FiBoardingGrid
        {...props}
        showSendButton={records.length > 0}
        sending={sending}
        onSend={handleSend}
      />
    </>
  );
};
