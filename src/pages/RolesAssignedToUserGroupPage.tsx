import { FC, useMemo, useState } from 'react';
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';

type Mode = 'all' | 'no-roles' | '';

interface RolesAssignedHeaderProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const RolesAssignedHeader: FC<RolesAssignedHeaderProps> = ({ mode, onModeChange }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Roles Assigned to User Group
      </Typography>

      <RadioGroup row value={mode} onChange={(e) => onModeChange(e.target.value as Mode)}>
        <FormControlLabel value="all" control={<Radio />} label="All User Groups" />
        <FormControlLabel value="no-roles" control={<Radio />} label="User Groups with NO Roles assigned" />
      </RadioGroup>
    </Box>
  );
};

const RolesAssignedGrid = withDataGrid<RolesAssignedHeaderProps>(RolesAssignedHeader);

interface RoleAssignedRecord {
  id: string;
  clientId: string;
  portfolioName: string;
  dpServiceCode: string;
  userGroupName: string;
  ldapGroupUniqueId: string;
  groupStatus: string;
  createdBy: string;
  groupCreationDate: string;
  roleName: string;
  remark: string;
}

const ALL_ROWS: RoleAssignedRecord[] = [
  {
    id: '1',
    clientId: '1001',
    portfolioName: 'Alpha',
    dpServiceCode: 'DP-01',
    userGroupName: 'Fraud Ops',
    ldapGroupUniqueId: 'LDAP-1001',
    groupStatus: 'Active',
    createdBy: 'John Smith',
    groupCreationDate: '2026-01-20',
    roleName: 'Reviewer',
    remark: 'Primary',
  },
  {
    id: '2',
    clientId: '1002',
    portfolioName: 'Beta',
    dpServiceCode: 'DP-02',
    userGroupName: 'Risk Ops',
    ldapGroupUniqueId: 'LDAP-1002',
    groupStatus: 'Active',
    createdBy: 'Jane Johnson',
    groupCreationDate: '2026-01-18',
    roleName: 'Admin',
    remark: 'Secondary',
  },
];

const NO_ROLE_ROWS: RoleAssignedRecord[] = [
  {
    id: '3',
    clientId: '1003',
    portfolioName: 'Gamma',
    dpServiceCode: 'DP-03',
    userGroupName: 'Compliance',
    ldapGroupUniqueId: 'LDAP-1003',
    groupStatus: 'Inactive',
    createdBy: 'Michael Brown',
    groupCreationDate: '2026-01-05',
    roleName: '-',
    remark: 'None',
  },
];

export const RolesAssignedToUserGroupPage: FC = () => {
  const [mode, setMode] = useState<Mode>('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<RoleAssignedRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 160 },
      { field: 'dpServiceCode', headerName: 'DP Service Code', width: 150 },
      { field: 'userGroupName', headerName: 'User Group Name', width: 170 },
      { field: 'ldapGroupUniqueId', headerName: 'LDAP Group Unique ID', width: 190 },
      { field: 'groupStatus', headerName: 'Group Status', width: 140 },
      { field: 'createdBy', headerName: 'Created By', width: 160 },
      { field: 'groupCreationDate', headerName: 'Group Creation Date', width: 170 },
      { field: 'roleName', headerName: 'Role Name', width: 150 },
      { field: 'remark', headerName: 'Remark', width: 140 },
    ],
    []
  );

  const rows = mode === 'all' ? ALL_ROWS : mode === 'no-roles' ? NO_ROLE_ROWS : [];

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
    <RolesAssignedGrid
      {...props}
      mode={mode}
      onModeChange={(nextMode) => {
        setMode(nextMode);
        setPage(0);
      }}
    />
  );
};
