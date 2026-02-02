import { useEffect, FC } from 'react';
import { Container, Typography, Box, Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { AppDataGrid } from '@/components/datagrid/AppDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchItems, setPagination } from './itemsSlice';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const ItemsPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total, loading, pagination } = useAppSelector((state) => state.items);

  useEffect(() => {
    dispatch(
      fetchItems({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.searchText,
      })
    );
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

  const handleViewItem = (itemId: string) => {
    navigate(`/app/items/${itemId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Category', width: 180 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueGetter: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => handleViewItem(params.row.id)}
          color="primary"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Items</Typography>
      </Box>

      <Box sx={{ height: 600 }}>
        <AppDataGrid
          rows={items}
          columns={columns}
          rowCount={total}
          loading={loading}
          page={pagination.page}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchText={pagination.searchText}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search items..."
        />
      </Box>
    </Container>
  );
};
