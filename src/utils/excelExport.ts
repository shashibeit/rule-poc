/**
 * Excel Export Utility
 * 
 * Creates Excel files without using external libraries.
 * Uses HTML table format that Excel can open natively without format warnings.
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
 * Generates Excel compatible HTML content
 * Excel can open HTML tables saved as .xls files without format warnings
 */
function generateExcelHTML(options: ExcelExportOptions): string {
  const { sheetName = 'Sheet1', columns, data } = options;

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">\n';
  html += '<head>\n';
  html += '  <meta charset="UTF-8">\n';
  html += '  <!--[if gte mso 9]>\n';
  html += '  <xml>\n';
  html += '    <x:ExcelWorkbook>\n';
  html += '      <x:ExcelWorksheets>\n';
  html += '        <x:ExcelWorksheet>\n';
  html += `          <x:Name>${escapeXML(sheetName)}</x:Name>\n`;
  html += '          <x:WorksheetOptions>\n';
  html += '            <x:DisplayGridlines/>\n';
  html += '          </x:WorksheetOptions>\n';
  html += '        </x:ExcelWorksheet>\n';
  html += '      </x:ExcelWorksheets>\n';
  html += '    </x:ExcelWorkbook>\n';
  html += '  </xml>\n';
  html += '  <![endif]-->\n';
  html += '  <style>\n';
  html += '    table { border-collapse: collapse; width: 100%; }\n';
  html += '    th { background-color: #4472C4; color: white; font-weight: bold; padding: 8px; text-align: left; border: 1px solid #ddd; }\n';
  html += '    td { padding: 8px; border: 1px solid #ddd; }\n';
  html += '    tr:nth-child(even) { background-color: #f2f2f2; }\n';
  html += '  </style>\n';
  html += '</head>\n';
  html += '<body>\n';
  html += '  <table>\n';

  // Header Row
  html += '    <thead>\n';
  html += '      <tr>\n';
  columns.forEach((col) => {
    html += `        <th>${escapeXML(col.headerName)}</th>\n`;
  });
  html += '      </tr>\n';
  html += '    </thead>\n';

  // Data Rows
  html += '    <tbody>\n';
  data.forEach((row) => {
    html += '      <tr>\n';
    columns.forEach((col) => {
      const value = row[col.field];
      const cellValue = value === null || value === undefined ? '' : escapeXML(String(value));
      html += `        <td>${cellValue}</td>\n`;
    });
    html += '      </tr>\n';
  });
  html += '    </tbody>\n';

  html += '  </table>\n';
  html += '</body>\n';
  html += '</html>';

  return html;
}

/**
 * Downloads data as Excel file
 */
export function downloadExcel(options: ExcelExportOptions): void {
  try {
    // Generate Excel HTML
    const htmlContent = generateExcelHTML(options);

    // Create Blob with proper Excel MIME type
    const blob = new Blob([htmlContent], {
      type: 'application/vnd.ms-excel',
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
