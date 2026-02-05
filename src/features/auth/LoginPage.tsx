import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useAppDispatch } from '@/app/hooks';
import { login } from './authSlice';

export const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (role: 'admin' | 'reviewer') => {
    const user = {
      id: role === 'admin' ? '1' : '2',
      name: role === 'admin' ? 'Admin User' : 'Reviewer User',
      email: role === 'admin' ? 'admin@roleaudit.com' : 'reviewer@roleaudit.com',
      role,
    };

    dispatch(login(user));
    navigate('/app');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" align="center" gutterBottom>
            RoleAudit
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Select a role to login
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => handleLogin('admin')}
            >
              Login as Admin
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => handleLogin('reviewer')}
            >
              Login as Reviewer
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
