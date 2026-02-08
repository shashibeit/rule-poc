import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useAppDispatch } from '@/app/hooks';
import { login } from './authSlice';

export const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (role: 'Rule_Deployer' | 'Rule_Reviewer') => {
    const user = {
      id: role === 'Rule_Deployer' ? '1' : '2',
      name: role === 'Rule_Deployer' ? 'Rule Deployer' : 'Rule Reviewer',
      email: role === 'Rule_Deployer' ? 'ruledeployer@roleaudit.com' : 'rulereviewer@roleaudit.com',
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
              onClick={() => handleLogin('Rule_Deployer')}
            >
              Login as Rule Deployer
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => handleLogin('Rule_Reviewer')}
            >
              Login as Rule Reviewer
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
