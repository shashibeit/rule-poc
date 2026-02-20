import { useState } from 'react';
import {
  ExcelValidationError,
  ExcelValidationOptions,
  isValidExcelFile,
  parseExcelToJson,
  ParsedExcelResult,
  validateParsedExcelRows,
} from '@/utils/excelParser';

export interface UseExcelParserState<T extends Record<string, unknown>> {
  parsing: boolean;
  parsed: ParsedExcelResult<T> | null;
  errors: ExcelValidationError[];
  errorMessage: string | null;
}

export const useExcelParser = <T extends Record<string, unknown> = Record<string, unknown>>() => {
  const [state, setState] = useState<UseExcelParserState<T>>({
    parsing: false,
    parsed: null,
    errors: [],
    errorMessage: null,
  });

  const reset = () => {
    setState({
      parsing: false,
      parsed: null,
      errors: [],
      errorMessage: null,
    });
  };

  const parseFile = async (file: File, options: ExcelValidationOptions<T> = {}) => {
    if (!isValidExcelFile(file)) {
      setState({
        parsing: false,
        parsed: null,
        errors: [],
        errorMessage: 'Please upload a valid CSV file (.csv)',
      });
      return null;
    }

    setState((prev) => ({ ...prev, parsing: true, errorMessage: null, errors: [] }));

    try {
      const parsed = await parseExcelToJson<T>(file);
      const validation = validateParsedExcelRows(parsed, options);

      setState({
        parsing: false,
        parsed,
        errors: validation.errors,
        errorMessage: null,
      });

      return {
        parsed,
        validation,
      };
    } catch (error) {
      setState({
        parsing: false,
        parsed: null,
        errors: [],
        errorMessage: error instanceof Error ? error.message : 'Failed to parse Excel file',
      });
      return null;
    }
  };

  return {
    ...state,
    parseFile,
    reset,
  };
};
