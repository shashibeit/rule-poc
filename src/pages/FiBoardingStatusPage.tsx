import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchFiBoardingStatus, FiBoardingStatusRecord } from '@/features/reports/fiBoardingStatusSlice';
import { useExcelExport } from '@/hooks/useExcelExport';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface FiBoardingStatusHeaderProps {
  onDownloadExcel: () => void;
  onDownloadCSV: () => void;
  isExporting: boolean;
  hasData: boolean;
}

const FiBoardingStatusHeader: FC<FiBoardingStatusHeaderProps> = ({
  onDownloadExcel,
  onDownloadCSV,
  isExporting,
  hasData,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          FI Boarding Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={onDownloadExcel}
            disabled={isExporting || !hasData}
          >
            Download Excel
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={onDownloadCSV}
            disabled={isExporting || !hasData}
          >
            Download CSV
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const FiBoardingStatusGrid = withDataGrid<FiBoardingStatusHeaderProps>(FiBoardingStatusHeader);

export const FiBoardingStatusPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading, error } = useAppSelector((state) => state.fiBoardingStatus);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchFiBoardingStatus());
  }, [dispatch]);

  const columns = useMemo<GridColDef<FiBoardingStatusRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 140 },
      { field: 'serviceCode', headerName: 'Service Code', width: 140 },
      { field: 'fiName', headerName: 'FI Name', width: 180 },
      { field: 'onFiDetails', headerName: 'On FI Details', width: 160 },
      { field: 'onOrgClientDetails', headerName: 'On Org Client Details', width: 190 },
      { field: 'status', headerName: 'Status', width: 130 },
      { field: 'details', headerName: 'Details', width: 280 },
    ],
    []
  );

  // Excel export hook
  const { exportToExcel, exportToCSV, isExporting } = useExcelExport(
    records,
    columns,
    {
      filename: 'fi-boarding-status',
      sheetName: 'FI Boarding Status',
    }
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
  };

  return (
    <FiBoardingStatusGrid
      {...props}
      onDownloadExcel={exportToExcel}
      onDownloadCSV={exportToCSV}
      isExporting={isExporting}
      hasData={records.length > 0}
      toolbar={
        error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : undefined
      }
    />
  );
};
