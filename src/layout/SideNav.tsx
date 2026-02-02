import { FC, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Collapse,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppSelector } from '@/app/hooks';
import { menuConfig, MenuItem } from './menuConfig';

const DRAWER_WIDTH = 240;

interface SideNavProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'temporary';
}

export const SideNav: FC<SideNavProps> = ({ open, onClose, variant = 'permanent' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAppSelector((state) => state.auth.user?.role);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const handleNavigate = (path: string) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const activeStyles = useMemo(
    () => ({
      '&.Mui-selected': {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        '& .MuiListItemIcon-root': {
          color: 'primary.contrastText',
        },
      },
      '&.Mui-selected:hover': {
        bgcolor: 'primary.dark',
      },
    }),
    []
  );

  const isPathActive = (path?: string) => !!(path && location.pathname === path);

  const isAnyChildActive = (children?: MenuItem[]) =>
    !!children?.some((child) => isPathActive(child.path));

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    if (!role || !item.roles.includes(role)) {
      return null;
    }

    const hasChildren = !!item.children?.length;
    const isActive = isPathActive(item.path) || (hasChildren && isAnyChildActive(item.children));
    const isOpen = openGroups[item.label] ?? (hasChildren && isAnyChildActive(item.children));

    return (
      <Box key={item.label}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => (hasChildren ? toggleGroup(item.label) : item.path && handleNavigate(item.path))}
            selected={isActive}
            sx={{
              pl: depth === 0 ? 2 : 4,
              ...activeStyles,
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
            {hasChildren ? (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <Box>
      <Toolbar />
      <List>{menuConfig.map((item) => renderMenuItem(item))}</List>
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
