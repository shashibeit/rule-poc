import { FC, useMemo, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';

interface RolesAssignedSubTenantHeaderProps {
  clientId: string;
  userName: string;
  errors: { clientId?: string; userName?: string };
  onClientIdChange: (value: string) => void;
  onUserNameChange: (value: string) => void;
  onSearch: () => void;
  onSearchAll: () => void;
}

const RolesAssignedSubTenantHeader: FC<RolesAssignedSubTenantHeaderProps> = ({
  clientId,
  userName,
  errors,
  onClientIdChange,
  onUserNameChange,
  onSearch,
  onSearchAll,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Roles Assigned to Sub-Tenant Users
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Client ID"
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
            error={!!errors.clientId}
            helperText={errors.clientId}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            OR
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="User Name"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            error={!!errors.userName}
            helperText={errors.userName}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={onSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={onSearchAll}>
              Search All
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const RolesAssignedSubTenantGrid = withDataGrid<RolesAssignedSubTenantHeaderProps>(
  RolesAssignedSubTenantHeader
);

interface SubTenantRoleRecord {
  id: string;
  clientId: string;
  userName: string;
  roleName: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

const MOCK_ROWS: SubTenantRoleRecord[] = [
  {
    id: '1',
    clientId: '1001',
    userName: 'jsmith',
    roleName: 'Reviewer',
    status: 'Active',
    createdBy: 'Admin',
    createdAt: '2026-01-20',
  },
  {
    id: '2',
    clientId: '1002',
    userName: 'jjohnson',
    roleName: 'Admin',
    status: 'Active',
    createdBy: 'Admin',
    createdAt: '2026-01-18',
  },
];

export const RolesAssignedToSubTenantUsersPage: FC = () => {
  const [clientId, setClientId] = useState('');
  const [userName, setUserName] = useState('');
  const [errors, setErrors] = useState<{ clientId?: string; userName?: string }>({});
  const [rows, setRows] = useState<SubTenantRoleRecord[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<SubTenantRoleRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'userName', headerName: 'User Name', width: 160 },
      { field: 'roleName', headerName: 'Role Name', width: 160 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'createdBy', headerName: 'Created By', width: 160 },
      { field: 'createdAt', headerName: 'Created At', width: 150 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: rows.slice(page * pageSize, page * pageSize + pageSize),
    columns,
    rowCount: rows.length,
    loading: false,
    page,
    pageSize,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: (newPageSize) => {
      setPage(0);
      setPageSize(newPageSize);
    },
  };

  return (
    <RolesAssignedSubTenantGrid
      {...props}
      clientId={clientId}
      userName={userName}
      errors={errors}
      onClientIdChange={setClientId}
      onUserNameChange={setUserName}
      onSearch={() => {
        const nextErrors: { clientId?: string; userName?: string } = {};
        const hasClientId = clientId.trim().length > 0;
        const hasUserName = userName.trim().length > 0;

        if (!hasClientId && !hasUserName) {
          nextErrors.clientId = 'Client ID or User Name is required';
          nextErrors.userName = 'Client ID or User Name is required';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
          setRows([]);
          return;
        }

        setRows(MOCK_ROWS);
        setPage(0);
      }}
      onSearchAll={() => {
        setErrors({});
        setRows(MOCK_ROWS);
        setPage(0);
      }}
    />
  );
};
