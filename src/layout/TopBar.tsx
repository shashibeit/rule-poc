import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: FC<TopBarProps> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const stageRefreshLabel = 'Last Stage Rule Refresh Date and Time: 02/06/2026 03:12 PM CST';
  const prodRefreshLabel = 'Last Prod Rule Refresh Date and Time: 02/06/2026 04:05 PM CST';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: (theme) => theme.palette.grey[100],
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 120, px: 2, alignItems: 'stretch' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 1, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              />
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              />
            </Box>
            <Typography variant="h3" component="div" sx={{ ml: 1 }}>
              RoleAudit
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                {stageRefreshLabel}
              </Typography>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                {prodRefreshLabel}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                Welcome: {user?.name ?? 'User'}
              </Typography>
              <Button
                color="info"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
