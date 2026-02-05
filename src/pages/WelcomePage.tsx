import { FC } from 'react';
import { Box, Container, Typography } from '@mui/material';

export const WelcomePage: FC = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
          Welcome Debit Protech Fraud Rule Administrator
        </Typography>
      </Box>
    </Container>
  );
};
