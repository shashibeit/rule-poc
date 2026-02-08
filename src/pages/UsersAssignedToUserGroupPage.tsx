import { FC, useMemo, useState } from 'react';
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';

type Mode = 'all' | 'no-users' | 'unassigned' | '';

interface UsersAssignedHeaderProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const UsersAssignedHeader: FC<UsersAssignedHeaderProps> = ({ mode, onModeChange }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users Assigned to User Group
      </Typography>

      <RadioGroup row value={mode} onChange={(e) => onModeChange(e.target.value as Mode)}>
        <FormControlLabel value="all" control={<Radio />} label="All User Groups" />
        <FormControlLabel value="no-users" control={<Radio />} label="User Group with NO Users Assigned" />
        <FormControlLabel value="unassigned" control={<Radio />} label="Users not assigned to any User Group" />
      </RadioGroup>
    </Box>
  );
};

const UsersAssignedGrid = withDataGrid<UsersAssignedHeaderProps>(UsersAssignedHeader);

interface UserGroupRecord {
  id: string;
  userName: string;
  userStatus: string;
  clientId: string;
  portfolioName: string;
  dpServiceCode: string;
  groupName: string;
  groupStatus: string;
  groupCreationDate: string;
  groupCreatedBy: string;
  validationStatus: string;
  ldapGroupUniqueId: string;
}

interface UnassignedUserRecord {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  createdBy: string;
  creationDate: string;
  userStatus: string;
  clientId: string;
  portfolioName: string;
  dpServiceCode: string;
}

const ALL_USERS: UserGroupRecord[] = [
  {
    id: '1',
    userName: 'jsmith',
    userStatus: 'Active',
    clientId: '1001',
    portfolioName: 'Alpha',
    dpServiceCode: 'DP-01',
    groupName: 'Fraud Ops',
    groupStatus: 'Active',
    groupCreationDate: '2026-01-20',
    groupCreatedBy: 'John Smith',
    validationStatus: 'Valid',
    ldapGroupUniqueId: 'LDAP-1001',
  },
  {
    id: '2',
    userName: 'jjohnson',
    userStatus: 'Inactive',
    clientId: '1002',
    portfolioName: 'Beta',
    dpServiceCode: 'DP-02',
    groupName: 'Risk Ops',
    groupStatus: 'Active',
    groupCreationDate: '2026-01-18',
    groupCreatedBy: 'Jane Johnson',
    validationStatus: 'Pending',
    ldapGroupUniqueId: 'LDAP-1002',
  },
];

const NO_USER_GROUPS: UserGroupRecord[] = [
  {
    id: '3',
    userName: 'mbrown',
    userStatus: 'Active',
    clientId: '1003',
    portfolioName: 'Gamma',
    dpServiceCode: 'DP-03',
    groupName: 'Compliance',
    groupStatus: 'Inactive',
    groupCreationDate: '2026-01-05',
    groupCreatedBy: 'Michael Brown',
    validationStatus: 'Valid',
    ldapGroupUniqueId: 'LDAP-1003',
  },
];

const UNASSIGNED_USERS: UnassignedUserRecord[] = [
  {
    id: '4',
    userName: 'slee',
    firstName: 'Sarah',
    lastName: 'Lee',
    createdBy: 'System',
    creationDate: '2026-01-12',
    userStatus: 'Active',
    clientId: '1004',
    portfolioName: 'Delta',
    dpServiceCode: 'DP-04',
  },
  {
    id: '5',
    userName: 'dcarter',
    firstName: 'David',
    lastName: 'Carter',
    createdBy: 'System',
    creationDate: '2026-01-08',
    userStatus: 'Inactive',
    clientId: '1005',
    portfolioName: 'Omega',
    dpServiceCode: 'DP-05',
  },
];

export const UsersAssignedToUserGroupPage: FC = () => {
  const [mode, setMode] = useState<Mode>('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const allGroupColumns = useMemo<GridColDef<UserGroupRecord>[]>(
    () => [
      { field: 'userName', headerName: 'User Name', width: 150 },
      { field: 'userStatus', headerName: 'User Status', width: 130 },
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 160 },
      { field: 'dpServiceCode', headerName: 'DP Service Code', width: 150 },
      { field: 'groupName', headerName: 'Group Name', width: 150 },
      { field: 'groupStatus', headerName: 'Group Status', width: 140 },
      { field: 'groupCreationDate', headerName: 'Group Creation Date', width: 170 },
      { field: 'groupCreatedBy', headerName: 'Group Created By', width: 170 },
      { field: 'validationStatus', headerName: 'Validation Status', width: 160 },
      { field: 'ldapGroupUniqueId', headerName: 'LDAP Group Unique ID', width: 190 },
    ],
    []
  );

  const unassignedColumns = useMemo<GridColDef<UnassignedUserRecord>[]>(
    () => [
      { field: 'userName', headerName: 'User Name', width: 150 },
      { field: 'firstName', headerName: 'First Name', width: 140 },
      { field: 'lastName', headerName: 'Last Name', width: 140 },
      { field: 'createdBy', headerName: 'Created By', width: 160 },
      { field: 'creationDate', headerName: 'Creation Date', width: 160 },
      { field: 'userStatus', headerName: 'User Status', width: 130 },
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 160 },
      { field: 'dpServiceCode', headerName: 'DP Service Code', width: 150 },
    ],
    []
  );

  const rows = mode === 'all' ? ALL_USERS : mode === 'no-users' ? NO_USER_GROUPS : mode === 'unassigned' ? UNASSIGNED_USERS : [];
  const columns = mode === 'unassigned' ? unassignedColumns : allGroupColumns;

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
    <UsersAssignedGrid
      {...props}
      mode={mode}
      onModeChange={(nextMode) => {
        setMode(nextMode);
        setPage(0);
      }}
    />
  );
};
