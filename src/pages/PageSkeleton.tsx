import { FC, ReactNode } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

interface PageSkeletonProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export const PageSkeleton: FC<PageSkeletonProps> = ({ title, subtitle, children }) => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      <Paper sx={{ p: 3, minHeight: 320 }}>
        {children || (
          <Box sx={{ color: 'text.secondary' }}>
            This is a placeholder page for {title}.
          </Box>
        )}
      </Paper>
    </Container>
  );
};
