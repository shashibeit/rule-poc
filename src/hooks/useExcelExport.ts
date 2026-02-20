import { useCallback, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { downloadExcel, downloadCSV, ExcelColumn } from '@/utils/excelExport';

export interface UseExcelExportOptions {
  filename?: string;
  sheetName?: string;
}

export interface UseExcelExportReturn {
  exportToExcel: () => void;
  exportToCSV: () => void;
  isExporting: boolean;
  error: string | null;
}

/**
 * Custom hook for exporting grid data to Excel or CSV
 * 
 * @example
 * ```tsx
 * const { exportToExcel, exportToCSV, isExporting } = useExcelExport({
 *   data: records,
 *   columns: gridColumns,
 *   filename: 'user-report',
 *   sheetName: 'User Report'
 * });
 * 
 * <Button onClick={exportToExcel} disabled={isExporting}>
 *   Download Excel
 * </Button>
 * ```
 */
export function useExcelExport<T extends Record<string, any>>(
  data: T[],
  columns: GridColDef<T>[],
  options: UseExcelExportOptions = {}
): UseExcelExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    filename = 'export',
    sheetName = 'Sheet1',
  } = options;

  /**
   * Converts MUI DataGrid columns to Excel columns
   */
  const convertColumns = useCallback((): ExcelColumn[] => {
    return columns
      .filter((col) => col.field !== 'actions' && col.field !== 'id') // Exclude action and id columns typically
      .map((col) => ({
        field: col.field,
        headerName: col.headerName || col.field,
        width: typeof col.width === 'number' ? col.width : undefined,
      }));
  }, [columns]);

  /**
   * Prepares data for export by extracting only the relevant fields
   */
  const prepareData = useCallback((excelColumns: ExcelColumn[]): Record<string, any>[] => {
    return data.map((row) => {
      const preparedRow: Record<string, any> = {};
      excelColumns.forEach((col) => {
        preparedRow[col.field] = row[col.field];
      });
      return preparedRow;
    });
  }, [data]);

  /**
   * Exports data to Excel format
   */
  const exportToExcel = useCallback(() => {
    setIsExporting(true);
    setError(null);

    try {
      const excelColumns = convertColumns();
      const preparedData = prepareData(excelColumns);

      downloadExcel({
        filename,
        sheetName,
        columns: excelColumns,
        data: preparedData,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export to Excel';
      setError(errorMessage);
      console.error('Export to Excel failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, [filename, sheetName, convertColumns, prepareData]);

  /**
   * Exports data to CSV format
   */
  const exportToCSV = useCallback(() => {
    setIsExporting(true);
    setError(null);

    try {
      const excelColumns = convertColumns();
      const preparedData = prepareData(excelColumns);

      downloadCSV({
        filename,
        sheetName,
        columns: excelColumns,
        data: preparedData,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export to CSV';
      setError(errorMessage);
      console.error('Export to CSV failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, [filename, sheetName, convertColumns, prepareData]);

  return {
    exportToExcel,
    exportToCSV,
    isExporting,
    error,
  };
}
