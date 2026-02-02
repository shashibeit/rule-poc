import { FC } from 'react';
import { Box, Button } from '@mui/material';

export interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const FormActions: FC<FormActionsProps> = ({
  onSave,
  onCancel,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  disabled = false,
  loading = false,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
      <Button onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button
        variant="contained"
        onClick={onSave}
        disabled={disabled || loading}
      >
        {saveLabel}
      </Button>
    </Box>
  );
};
