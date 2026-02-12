/**
 * Utility functions for DataGrid components
 */

/**
 * Generates a unique ID for DataGrid rows based on available fields
 * Tries common id fields first, then falls back to generating from content
 */
export function generateRowId(row: Record<string, any>, index: number): string {
  // Try common ID fields first
  const idFields = ['id', '_id', 'uuid', 'key', 'rowId'];
  for (const field of idFields) {
    if (row[field] && (typeof row[field] === 'string' || typeof row[field] === 'number')) {
      return String(row[field]);
    }
  }

  // Try combining meaningful fields for more stable IDs
  const meaningfulFields = ['userId', 'clientId', 'name', 'email', 'code', 'title'];
  const parts: string[] = [];
  
  for (const field of meaningfulFields) {
    if (row[field] && typeof row[field] === 'string') {
      parts.push(row[field]);
    }
  }

  // If we have meaningful parts, use them with index
  if (parts.length > 0) {
    return `${parts.join('-')}-${index}`;
  }

  // Last resort: hash of row content + index
  const contentHash = hashObject(row);
  return `row-${contentHash}-${index}`;
}

/**
 * Simple hash function for objects
 */
function hashObject(obj: Record<string, any>): string {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Client-side pagination utility for when all data is loaded at once
 */
export interface ClientPaginationResult<T> {
  paginatedData: readonly T[];
  totalCount: number;
  pageCount: number;
}

export function clientSidePaginate<T>(
  data: readonly T[],
  page: number,
  pageSize: number
): ClientPaginationResult<T> {
  const totalCount = data.length;
  const pageCount = Math.ceil(totalCount / pageSize);
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    paginatedData,
    totalCount,
    pageCount,
  };
}

/**
 * Client-side search utility
 */
export function clientSideSearch<T>(
  data: readonly T[],
  searchText: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchText.trim()) {
    return [...data];
  }

  const lowercaseSearch = searchText.toLowerCase();
  return [...data].filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseSearch);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowercaseSearch);
      }
      return false;
    })
  );
}

/**
 * Enhanced getRowId function that handles missing IDs
 */
export function createRowIdGetter<T extends Record<string, any>>() {
  return (row: T, index?: number): string => {
    return generateRowId(row, index ?? 0);
  };
}