/**
 * Excel Export Utility
 * 
 * Creates Excel files without using external libraries.
 * Uses XML-based Excel format (SpreadsheetML) that can be opened by Excel and other spreadsheet applications.
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
 * Escapes special XML characters
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
 * Formats a cell value based on its type
 */
function getCellValue(value: any): { type: string; value: string } {
  if (value === null || value === undefined || value === '') {
    return { type: 'String', value: '' };
  }

  // Check if it's a number
  if (typeof value === 'number') {
    return { type: 'Number', value: String(value) };
  }

  // Check if string is a valid number
  const strValue = String(value);
  if (!isNaN(Number(strValue)) && strValue.trim() !== '') {
    return { type: 'Number', value: strValue };
  }

  // Default to string
  return { type: 'String', value: escapeXML(strValue) };
}

/**
 * Generates Excel XML content
 */
function generateExcelXML(options: ExcelExportOptions): string {
  const { sheetName = 'Sheet1', columns, data } = options;

  // Start XML document
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?mso-application progid="Excel.Sheet"?>\n';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
  xml += '  xmlns:o="urn:schemas-microsoft-com:office:office"\n';
  xml += '  xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
  xml += '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
  xml += '  xmlns:html="http://www.w3.org/TR/REC-html40">\n';

  // Document Properties
  xml += '  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">\n';
  xml += `    <Created>${new Date().toISOString()}</Created>\n`;
  xml += '  </DocumentProperties>\n';

  // Styles
  xml += '  <Styles>\n';
  xml += '    <Style ss:ID="Default" ss:Name="Normal">\n';
  xml += '      <Alignment ss:Vertical="Bottom"/>\n';
  xml += '    </Style>\n';
  xml += '    <Style ss:ID="Header">\n';
  xml += '      <Font ss:Bold="1" ss:Size="11"/>\n';
  xml += '      <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>\n';
  xml += '      <Font ss:Color="#FFFFFF" ss:Bold="1"/>\n';
  xml += '      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n';
  xml += '      <Borders>\n';
  xml += '        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n';
  xml += '      </Borders>\n';
  xml += '    </Style>\n';
  xml += '    <Style ss:ID="Data">\n';
  xml += '      <Borders>\n';
  xml += '        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7E6E6"/>\n';
  xml += '      </Borders>\n';
  xml += '    </Style>\n';
  xml += '  </Styles>\n';

  // Worksheet
  xml += `  <Worksheet ss:Name="${escapeXML(sheetName)}">\n`;
  
  // Calculate column count
  const columnCount = columns.length;
  const rowCount = data.length + 1; // +1 for header

  xml += `    <Table ss:ExpandedColumnCount="${columnCount}" ss:ExpandedRowCount="${rowCount}" x:FullColumns="1" x:FullRows="1">\n`;

  // Column widths
  columns.forEach((col) => {
    const width = col.width || 100;
    xml += `      <Column ss:Width="${width}"/>\n`;
  });

  // Header Row
  xml += '      <Row ss:Height="20">\n';
  columns.forEach((col) => {
    xml += '        <Cell ss:StyleID="Header">\n';
    xml += `          <Data ss:Type="String">${escapeXML(col.headerName)}</Data>\n`;
    xml += '        </Cell>\n';
  });
  xml += '      </Row>\n';

  // Data Rows
  data.forEach((row) => {
    xml += '      <Row>\n';
    columns.forEach((col) => {
      const cellValue = getCellValue(row[col.field]);
      xml += '        <Cell ss:StyleID="Data">\n';
      xml += `          <Data ss:Type="${cellValue.type}">${cellValue.value}</Data>\n`;
      xml += '        </Cell>\n';
    });
    xml += '      </Row>\n';
  });

  xml += '    </Table>\n';
  xml += '  </Worksheet>\n';
  xml += '</Workbook>';

  return xml;
}

/**
 * Downloads data as Excel file
 */
export function downloadExcel(options: ExcelExportOptions): void {
  try {
    // Generate Excel XML
    const xmlContent = generateExcelXML(options);

    // Create Blob
    const blob = new Blob([xmlContent], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
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
