import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { UserRole } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const role = useAppSelector((state) => state.auth.user?.role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/app/unauthorized" replace />;
  }

  return <>{children}</>;
};
