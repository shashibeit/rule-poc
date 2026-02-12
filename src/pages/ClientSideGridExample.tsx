import { FC, useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { AppDataGrid } from '@/components/datagrid/AppDataGrid';

// Example data that might not have proper unique IDs
const SAMPLE_DATA = [
  { name: 'John Doe', email: 'john@example.com', status: 'active', department: 'Engineering', salary: 75000 },
  { name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', department: 'Marketing', salary: 65000 },
  { name: 'Bob Johnson', email: 'bob@example.com', status: 'active', department: 'Sales', salary: 55000 },
  // Duplicate names to test ID generation
  { name: 'John Doe', email: 'john.doe2@example.com', status: 'active', department: 'Finance', salary: 80000 },
  { name: 'Alice Brown', email: 'alice@example.com', status: 'active', department: 'Engineering', salary: 90000 },
  { name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive', department: 'HR', salary: 60000 },
  { name: 'Diana Davis', email: 'diana@example.com', status: 'active', department: 'Engineering', salary: 85000 },
  { name: 'Eve Miller', email: 'eve@example.com', status: 'active', department: 'Marketing', salary: 70000 },
  { name: 'Frank Garcia', email: 'frank@example.com', status: 'inactive', department: 'Sales', salary: 50000 },
  { name: 'Grace Lee', email: 'grace@example.com', status: 'active', department: 'Finance', salary: 75000 },
  // Some records without certain fields to test robustness
  { name: 'Henry Taylor', status: 'active', department: 'Engineering', salary: 95000 },
  { email: 'mystery@example.com', status: 'inactive', department: 'IT', salary: 70000 },
  { name: 'Ivan Petrov', email: 'ivan@example.com', department: 'Marketing', salary: 65000 },
  { name: 'Julia Chen', email: 'julia@example.com', status: 'active', salary: 80000 },
  { name: 'Kevin Brown', email: 'kevin@example.com', status: 'active', department: 'Sales', salary: 58000 },
];

export const ClientSideGridExample: FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      renderCell: (params) => params.value || 'N/A',
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      renderCell: (params) => params.value || 'N/A',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        if (!status) return <Chip label="Unknown" size="small" color="default" />;
        
        return (
          <Chip
            label={status}
            size="small"
            color={status === 'active' ? 'success' : 'error'}
          />
        );
      },
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 130,
      renderCell: (params) => params.value || 'N/A',
    },
    {
      field: 'salary',
      headerName: 'Salary',
      width: 120,
      valueFormatter: (value: number | undefined) => value ? `$${value.toLocaleString()}` : 'N/A',
    },
  ];

  // Define which fields should be searchable
  const searchFields = ['name', 'email', 'department', 'status'];

  return (
    <Box sx={{ height: '100vh', p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Client-Side DataGrid Example
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This example demonstrates client-side pagination and search with data that doesn't have unique IDs.
          The system automatically generates stable IDs based on content.
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchText('');
              setPage(0);
            }}
            sx={{ mr: 1 }}
          >
            Clear Search
          </Button>
          <Typography variant="body2" color="text.secondary">
            Total Records: {SAMPLE_DATA.length} | 
            Search in: {searchFields.join(', ')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: 600 }}>
        <AppDataGrid
          rows={SAMPLE_DATA}
          columns={columns}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(0); // Reset to first page
          }}
          searchText={searchText}
          onSearchChange={(text) => {
            setSearchText(text);
            setPage(0); // Reset to first page when searching
          }}
          clientSidePagination={true}
          searchFields={searchFields}
          searchPlaceholder="Search employees..."
        />
      </Box>
    </Box>
  );
};