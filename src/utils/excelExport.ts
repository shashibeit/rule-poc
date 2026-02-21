/**
 * Excel Export Utility
 * 
 * Creates Excel files without using external libraries.
 * Uses SpreadsheetML format (XML-based Excel format) that Excel opens without warnings.
 */

export interface ExcelColumn {
  field: string;
  headerName: string;
  width?: number;
}

export interface ExcelExportOptions {
  filename: string;
  sheetName?: string;
  columns: ExcelColumn[];
  data: Record<string, any>[];
}

/**
 * Escapes special HTML/XML characters
 */
function escapeXML(text: any): string {
  if (text === null || text === undefined) {
    return '';
  }
  
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates Excel SpreadsheetML XML content
 * This is the native XML format that Excel recognizes and opens without warnings
 */
function generateExcelXML(options: ExcelExportOptions): string {
  const { sheetName = 'Sheet1', columns, data } = options;

  let html = '<?xml version="1.0"?>\n';
  html += '<?mso-application progid="Excel.Sheet"?>\n';
  html += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
  html += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
  html += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
  html += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
  html += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
  
  html += ' <Styles>\n';
  html += '  <Style ss:ID="Header">\n';
  html += '   <Font ss:Bold="1" ss:Color="#FFFFFF"/>\n';
  html += '   <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>\n';
  html += '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n';
  html += '  </Style>\n';
  html += ' </Styles>\n';
  
  html += ` <Worksheet ss:Name="${escapeXML(sheetName)}">\n`;
  html += '  <Table>\n';

  // Header Row
  html += '   <Row>\n';
  columns.forEach((col) => {
    html += '    <Cell ss:StyleID="Header"><Data ss:Type="String">' + escapeXML(col.headerName) + '</Data></Cell>\n';
  });
  html += '   </Row>\n';

  // Data Rows
  data.forEach((row) => {
    html += '   <Row>\n';
    columns.forEach((col) => {
      const value = row[col.field];
      const cellValue = value === null || value === undefined ? '' : escapeXML(String(value));
      html += '    <Cell><Data ss:Type="String">' + cellValue + '</Data></Cell>\n';
    });
    html += '   </Row>\n';
  });

  html += '  </Table>\n';
  html += ' </Worksheet>\n';
  html += '</Workbook>';

  return html;
}

/**
 * Downloads data as Excel file
 */
export function downloadExcel(options: ExcelExportOptions): void {
  try {
    // Generate Excel SpreadsheetML XML
    const xmlContent = generateExcelXML(options);

    // Add UTF-8 BOM to help Excel recognize the format and avoid warnings
    const BOM = '\ufeff';
    
    // Create Blob with BOM and proper Excel MIME type
    const blob = new Blob([BOM + xmlContent], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${options.filename}.xls`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export data to Excel');
  }
}

/**
 * Exports data to CSV format (alternative lightweight format)
 */
export function downloadCSV(options: ExcelExportOptions): void {
  try {
    const { columns, data, filename } = options;

    // Create CSV header
    const headers = columns.map((col) => `"${col.headerName.replace(/"/g, '""')}"`);
    let csvContent = headers.join(',') + '\n';

    // Create CSV rows
    data.forEach((row) => {
      const values = columns.map((col) => {
        const value = row[col.field];
        if (value === null || value === undefined) {
          return '""';
        }
        // Escape quotes and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvContent += values.join(',') + '\n';
    });

    // Create Blob
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export data to CSV');
  }
}
