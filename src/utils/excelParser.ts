export interface ParsedExcelResult<T extends Record<string, unknown> = Record<string, unknown>> {
  sheetName: string;
  headers: string[];
  rows: T[];
}

export interface ExcelValidationError {
  rowNumber: number;
  column: string;
  message: string;
}

export interface ExcelValidationResult {
  isValid: boolean;
  errors: ExcelValidationError[];
}

export interface ExcelValidationOptions<T extends Record<string, unknown>> {
  requiredColumns?: string[];
  customValidators?: Partial<Record<string, (value: unknown, row: T) => string | null>>;
  allowEmptyRows?: boolean;
}

export const isValidExcelFile = (file: File): boolean => {
  const validExtensions = ['.csv'];
  const lowerName = file.name.toLowerCase();
  return validExtensions.some((extension) => lowerName.endsWith(extension));
};

const normalizeKey = (value: string) => value.trim().toLowerCase();

export const parseExcelToJson = async <T extends Record<string, unknown> = Record<string, unknown>>(
  file: File
): Promise<ParsedExcelResult<T>> => {
  const csvText = await file.text();

  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    throw new Error('The uploaded CSV file is empty');
  }

  const parseCsvRow = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const nextChar = line[index + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  };

  const headers = parseCsvRow(lines[0]).map((header) => header.trim());
  if (headers.length === 0 || headers.every((header) => header === '')) {
    throw new Error('CSV header row is missing or invalid');
  }

  const rawRows = lines.slice(1).map((line) => {
    const values = parseCsvRow(line);
    const row: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    return row;
  });

  const fileBaseName = file.name.replace(/\.[^.]+$/, '') || 'Sheet1';

  return {
    sheetName: fileBaseName,
    headers,
    rows: rawRows as T[],
  };
};

export const validateParsedExcelRows = <T extends Record<string, unknown>>(
  parsed: ParsedExcelResult<T>,
  options: ExcelValidationOptions<T> = {}
): ExcelValidationResult => {
  const { requiredColumns = [], customValidators = {}, allowEmptyRows = false } = options;
  const errors: ExcelValidationError[] = [];

  const headerMap = new Map(parsed.headers.map((header) => [normalizeKey(header), header]));

  requiredColumns.forEach((requiredColumn) => {
    if (!headerMap.has(normalizeKey(requiredColumn))) {
      errors.push({
        rowNumber: 0,
        column: requiredColumn,
        message: `Required column '${requiredColumn}' is missing`,
      });
    }
  });

  parsed.rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const isEmptyRow = Object.values(row).every((value) => String(value ?? '').trim() === '');

    if (!allowEmptyRows && isEmptyRow) {
      errors.push({
        rowNumber,
        column: '*',
        message: 'Row is empty',
      });
      return;
    }

    requiredColumns.forEach((requiredColumn) => {
      const existingHeader = headerMap.get(normalizeKey(requiredColumn));
      if (!existingHeader) {
        return;
      }
      const value = row[existingHeader as keyof T];
      if (String(value ?? '').trim() === '') {
        errors.push({
          rowNumber,
          column: existingHeader,
          message: 'Value is required',
        });
      }
    });

    Object.entries(customValidators).forEach(([column, validator]) => {
      if (!validator) {
        return;
      }
      const existingHeader = headerMap.get(normalizeKey(column));
      if (!existingHeader) {
        return;
      }
      const value = row[existingHeader as keyof T];
      const result = validator(value, row);
      if (result) {
        errors.push({
          rowNumber,
          column: existingHeader,
          message: result,
        });
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
