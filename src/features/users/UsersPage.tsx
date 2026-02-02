import { useEffect, useState, FC } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GridColDef } from '@mui/x-data-grid';
import { AppDataGrid } from '@/components/datagrid/AppDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchUsers, setPagination, deleteUser } from './usersSlice';
import { UserDialog } from './UserDialog';
import { User } from '@/types';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const UsersPage: FC = () => {
  const dispatch = useAppDispatch();
  const { users, total, loading, pagination, error } = useAppSelector((state) => state.users);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('UsersPage: Fetching users with pagination:', pagination);
    dispatch(
      fetchUsers({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.searchText,
      })
    ).then((result) => {
      console.log('UsersPage: Fetch result:', result);
    });
  }, [dispatch, pagination.page, pagination.pageSize, pagination.searchText]);

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(setPagination({ page: 0, pageSize }));
  };

  const handleSearchChange = (searchText: string) => {
    dispatch(setPagination({ page: 0, searchText }));
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(userId));
      dispatch(
        fetchUsers({
          page: pagination.page,
          pageSize: pagination.pageSize,
          search: pagination.searchText,
        })
      );
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDialogSuccess = () => {
    handleDialogClose();
    dispatch(
      fetchUsers({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.searchText,
      })
    );
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 250 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEditUser(params.row as User)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteUser(params.row.id)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Users Management</Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          <Typography>Error loading users: {error}</Typography>
        </Box>
      )}

      {!loading && users.length === 0 && !error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
          <Typography>No users found. The mock server may not be initialized.</Typography>
        </Box>
      )}

      <Box sx={{ height: 600 }}>
        <AppDataGrid
          rows={users}
          columns={columns}
          rowCount={total}
          loading={loading}
          page={pagination.page}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchText={pagination.searchText}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search users..."
          toolbarActions={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          }
        />
      </Box>

      <UserDialog
        open={dialogOpen}
        user={selectedUser}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />
    </Container>
  );
};
