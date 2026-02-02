import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { TopBar } from './TopBar';
import { SideNav } from './SideNav';

export const AppLayout: FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar onMenuClick={handleDrawerToggle} />
      
      {/* Mobile drawer */}
      <SideNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
      />
      
      {/* Desktop drawer */}
      <SideNav
        open={true}
        onClose={() => {}}
        variant="permanent"
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
