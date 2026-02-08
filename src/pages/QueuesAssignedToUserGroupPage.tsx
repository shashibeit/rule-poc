import { FC, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';

interface QueuesAssignedHeaderProps {
  userGroup: string;
  error?: string;
  onUserGroupChange: (value: string) => void;
  onSearch: () => void;
  onSearchAll: () => void;
  onSearchAllNoGroups: () => void;
}

const QueuesAssignedHeader: FC<QueuesAssignedHeaderProps> = ({
  userGroup,
  error,
  onUserGroupChange,
  onSearch,
  onSearchAll,
  onSearchAllNoGroups,
}) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Queues Assigned to User Group
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="User Group"
            value={userGroup}
            onChange={(e) => onUserGroupChange(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={onSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={onSearchAll}>
              Search All User Groups
            </Button>
            <Button variant="outlined" onClick={onSearchAllNoGroups}>
              Search All With No Groups
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const QueuesAssignedGrid = withDataGrid<QueuesAssignedHeaderProps>(QueuesAssignedHeader);

interface QueueAssignedRecord {
  id: string;
  clientId: string;
  portfolioName: string;
  dpServiceCode: string;
  userGroupName: string;
  ldapGroupUniqueId: string;
  groupStatus: string;
  createdBy: string;
  groupCreationDate: string;
  queueName: string;
  remark: string;
}

const MOCK_ROWS: QueueAssignedRecord[] = [
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
    queueName: 'Queue A',
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
    queueName: 'Queue B',
    remark: 'Secondary',
  },
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
    queueName: 'Queue C',
    remark: 'Review',
  },
];

const NO_GROUP_ROWS: QueueAssignedRecord[] = [
  {
    id: '4',
    clientId: '1004',
    portfolioName: 'Delta',
    dpServiceCode: 'DP-04',
    userGroupName: 'Unassigned',
    ldapGroupUniqueId: 'LDAP-1004',
    groupStatus: 'Inactive',
    createdBy: 'System',
    groupCreationDate: '2026-01-02',
    queueName: 'Queue D',
    remark: 'No group mapped',
  },
  {
    id: '5',
    clientId: '1005',
    portfolioName: 'Omega',
    dpServiceCode: 'DP-05',
    userGroupName: 'Unassigned',
    ldapGroupUniqueId: 'LDAP-1005',
    groupStatus: 'Inactive',
    createdBy: 'System',
    groupCreationDate: '2026-01-03',
    queueName: 'Queue E',
    remark: 'No group mapped',
  },
];

export const QueuesAssignedToUserGroupPage: FC = () => {
  const [userGroup, setUserGroup] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [rows, setRows] = useState<QueueAssignedRecord[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo<GridColDef<QueueAssignedRecord>[]>(
    () => [
      { field: 'clientId', headerName: 'Client ID', width: 120 },
      { field: 'portfolioName', headerName: 'Portfolio Name', width: 160 },
      { field: 'dpServiceCode', headerName: 'DP Service Code', width: 150 },
      { field: 'userGroupName', headerName: 'User Group Name', width: 170 },
      { field: 'ldapGroupUniqueId', headerName: 'LDAP Group Unique ID', width: 190 },
      { field: 'groupStatus', headerName: 'Group Status', width: 140 },
      { field: 'createdBy', headerName: 'Created By', width: 160 },
      { field: 'groupCreationDate', headerName: 'Group Creation Date', width: 170 },
      { field: 'queueName', headerName: 'Queue Name', width: 150 },
      { field: 'remark', headerName: 'Remark', width: 140 },
    ],
    []
  );

  const filteredRows = useMemo(() => {
    if (!rows.length) {
      return [] as QueueAssignedRecord[];
    }
    return rows;
  }, [rows]);

  const props: DataGridViewProps = {
    rows: filteredRows.slice(page * pageSize, page * pageSize + pageSize),
    columns,
    rowCount: filteredRows.length,
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
    <QueuesAssignedGrid
      {...props}
      userGroup={userGroup}
      error={error}
      onUserGroupChange={setUserGroup}
      onSearch={() => {
        const trimmed = userGroup.trim();
        if (!trimmed) {
          setError('User Group is required');
          setRows([]);
          return;
        }
        setError(undefined);
        setRows(MOCK_ROWS.filter((row) => row.userGroupName.toLowerCase().includes(trimmed.toLowerCase())));
        setPage(0);
      }}
      onSearchAll={() => {
        setError(undefined);
        setRows(MOCK_ROWS);
        setPage(0);
      }}
      onSearchAllNoGroups={() => {
        setError(undefined);
        setRows(NO_GROUP_ROWS);
        setPage(0);
      }}
    />
  );
};
