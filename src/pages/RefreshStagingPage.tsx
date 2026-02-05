import { FC, useEffect, useState } from 'react';
import { Alert, Container, Typography, Box } from '@mui/material';
import { apiClient } from '@/api/client';

interface RefreshResponse {
  success: boolean;
  message: string;
}

export const RefreshStagingPage: FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    apiClient
      .post<RefreshResponse>('/reports/refresh-staging')
      .then((res) => {
        if (isMounted) {
          setMessage(res.message);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMessage('Staging refresh failed');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Container maxWidth={false} disableGutters>
      <Typography variant="h4" gutterBottom>
        Refresh Staging
      </Typography>
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!loading && message && (
          <Alert severity="success">
            <Typography variant="h4">{message}</Typography>
          </Alert>
        )}
      </Box>
    </Container>
  );
};
