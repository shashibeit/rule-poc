import { FC } from 'react';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useAppSelector } from '@/app/hooks';

export const DashboardPage: FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  const stats = [
    {
      title: 'Total Users',
      value: '30',
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      color: '#1976d2',
      show: user?.role === 'Rule_Deployer',
    },
    {
      title: 'Total Items',
      value: '50',
      icon: <InventoryIcon sx={{ fontSize: 48 }} />,
      color: '#2e7d32',
      show: true,
    },
    {
      title: 'Active Items',
      value: '35',
      icon: <DashboardIcon sx={{ fontSize: 48 }} />,
      color: '#ed6c02',
      show: true,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        {stats
          .filter((stat) => stat.show)
          .map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 160,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: stat.color,
                    opacity: 0.3,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h3" sx={{ mt: 'auto', color: stat.color }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Info
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Role: <strong>{user?.role}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role === 'Rule_Deployer'
            ? 'As a rule deployer, you have access to deployment and refresh features.'
            : 'As a rule reviewer, you can access review and reporting features.'}
        </Typography>
      </Paper>
    </Container>
  );
};
