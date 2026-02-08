import { UserRole } from '@/types';
import RefreshIcon from '@mui/icons-material/Refresh';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import DownloadIcon from '@mui/icons-material/Download';
import NumbersIcon from '@mui/icons-material/Numbers';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import ArticleIcon from '@mui/icons-material/Article';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DomainIcon from '@mui/icons-material/Domain';
import GroupsIcon from '@mui/icons-material/Groups';
import { ReactNode } from 'react';

export interface MenuItem {
  label: string;
  path?: string;
  icon: ReactNode;
  roles: UserRole[];
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    label: 'Refresh Staging',
    path: '/app/refresh-staging',
    icon: <RefreshIcon />,
    roles: ['Rule_Deployer', 'Rule_Reviewer'],
  },
  {
    label: 'View Rule Changes',
    path: '/app/view-rule-changes',
    icon: <CompareArrowsIcon />,
    roles: ['Rule_Deployer', 'Rule_Reviewer'],
  },
  {
    label: 'View Staged Rule',
    path: '/app/view-staged-rule',
    icon: <FactCheckIcon />,
    roles: ['Rule_Reviewer'],
  },
  {
    label: 'Download Stage Rules',
    path: '/app/download-stage-rules',
    icon: <DownloadIcon />,
    roles: ['Rule_Reviewer'],
  },
  {
    label: 'Rule Count',
    path: '/app/rule-count',
    icon: <NumbersIcon />,
    roles: ['Rule_Reviewer'],
  },
  {
    label: 'Upload Rule Scheduler',
    path: '/app/upload-rule-scheduler',
    icon: <CloudUploadIcon />,
    roles: ['Rule_Reviewer'],
  },
  {
    label: 'Rule History',
    path: '/app/rule-history',
    icon: <HistoryIcon />,
    roles: ['Rule_Reviewer'],
  },
  {
    label: 'Review Rule Scheduler',
    path: '/app/rule-scheduler-history',
    icon: <HistoryToggleOffIcon />,
    roles: ['Rule_Deployer', 'Rule_Reviewer'],
  },
  {
    label: 'Prod Syncup',
    path: '/app/prod-syncup',
    icon: <CheckCircleOutlineIcon />,
    roles: ['Rule_Deployer', 'Rule_Reviewer'],
  },
  {
    label: 'View Prod Rules',
    path: '/app/view-prod-rules',
    icon: <CheckCircleOutlineIcon />,
    roles: ['Rule_Reviewer'],
  },
  {
    label: 'Refresh History',
    path: '/app/operation-history',
    icon: <HistoryToggleOffIcon />,
    roles: ['Rule_Deployer', 'Rule_Reviewer'],
  },
  {
    label: 'Card Group (CG) Information',
    icon: <GroupWorkIcon />,
    roles: ['Rule_Reviewer'],
    children: [
      {
        label: 'Get CG Count and PANs',
        path: '/app/card-group/get-cg-count-pans',
        icon: <GroupWorkIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'Search CG Using PAN',
        path: '/app/card-group/search-cg-using-pan',
        icon: <GroupWorkIcon />,
        roles: ['Rule_Reviewer'],
      },
    ],
  },
  {
    label: 'Hotlist Details',
    icon: <GppMaybeIcon />,
    roles: ['Rule_Reviewer'],
    children: [
      {
        label: 'FI Hotlist Check',
        path: '/app/hotlist/fi-hotlist-check',
        icon: <GppMaybeIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'Hotlist Audit History',
        path: '/app/hotlist/hotlist-audit-history',
        icon: <GppMaybeIcon />,
        roles: ['Rule_Reviewer'],
      },
    ],
  },
  {
    label: 'User Report',
    path: '/app/user-report',
    icon: <ArticleIcon />,
    roles: ['Rule_Reviewer'],
  },
  {
    label: 'Unique User Login Count Report',
    path: '/app/unique-user-login-count-report',
    icon: <PersonSearchIcon />,
    roles: ['Rule_Reviewer'],
  },
  {
    label: 'Portifolio Managment',
    icon: <DomainIcon />,
    roles: ['Rule_Reviewer'],
    children: [
      {
        label: 'Add FI',
        path: '/app/portfolio-management/add-fi',
        icon: <DomainIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'Search/Modify FI',
        path: '/app/portfolio-management/search-modify-fi',
        icon: <DomainIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'Modify DC Sub-Brand',
        path: '/app/portfolio-management/modify-dc-sub-brand',
        icon: <DomainIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'FI Boarding',
        path: '/app/portfolio-management/fi-boarding',
        icon: <DomainIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'FI Boarding Status',
        path: '/app/portfolio-management/fi-boarding-status',
        icon: <DomainIcon />,
        roles: ['Rule_Reviewer'],
      },
    ],
  },
  {
    label: 'User Group Information',
    icon: <GroupsIcon />,
    roles: ['Rule_Reviewer'],
    children: [
      {
        label: 'Queues Assigned to User Group',
        path: '/app/user-group/queues-assigned',
        icon: <GroupsIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'Users Assigned to User Group',
        path: '/app/user-group/users-assigned',
        icon: <GroupsIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'Roles Assigned to User Group',
        path: '/app/user-group/roles-assigned',
        icon: <GroupsIcon />,
        roles: ['Rule_Reviewer'],
      },
      {
        label: 'Roles Assigned to Sub-Tenant Users',
        path: '/app/user-group/roles-assigned-sub-tenant-users',
        icon: <GroupsIcon />,
        roles: ['Rule_Reviewer'],
      },
    ],
  },
];
