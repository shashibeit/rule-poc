import { FC, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { withDataGrid, DataGridViewProps } from '@/components/datagrid/withDataGrid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchRuleChanges, setRuleChangesPagination } from '@/features/reports/ruleChangesSlice';
import { RuleChangeRecord } from '@/types';

const Header: FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h4">View Rule Changes</Typography>
    </Box>
  );
};

const RuleChangesGrid = withDataGrid(Header);

export const ViewRuleChangesPage: FC = () => {
  const dispatch = useAppDispatch();
  const { records, total, loading, pagination } = useAppSelector((state) => state.ruleChanges);

  useEffect(() => {
    dispatch(
      fetchRuleChanges({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.searchText,
      })
    );
  }, [dispatch, pagination.page, pagination.pageSize, pagination.searchText]);

  const columns = useMemo<GridColDef<RuleChangeRecord>[]>(
    () => [
      { field: 'ruleCategory', headerName: 'Rule Category', flex: 1, minWidth: 180 },
      { field: 'ruleSet', headerName: 'Rule Set', flex: 1, minWidth: 160 },
      { field: 'ruleName', headerName: 'Rule Name', flex: 1, minWidth: 200 },
      { field: 'ruleMode', headerName: 'Rule Mode', width: 140 },
      { field: 'compare', headerName: 'Compare', width: 130 },
    ],
    []
  );

  const props: DataGridViewProps = {
    rows: records,
    columns,
    rowCount: total,
    loading,
    page: pagination.page,
    pageSize: pagination.pageSize,
    onPageChange: (newPage) => dispatch(setRuleChangesPagination({ page: newPage })),
    onPageSizeChange: (newPageSize) =>
      dispatch(setRuleChangesPagination({ page: 0, pageSize: newPageSize })),
    toolbar: (
      <TextField
        value={pagination.searchText}
        onChange={(e) => {
          dispatch(setRuleChangesPagination({ page: 0, searchText: e.target.value }));
        }}
        placeholder="Search rule changes..."
        size="small"
        sx={{ minWidth: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
  };

  return <RuleChangesGrid {...props} />;
};
