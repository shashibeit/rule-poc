import { useEffect, useState, FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
} from '@mui/material';
import { FieldText } from '@/components/form/FieldText';
import { FormActions } from '@/components/form/FormActions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { required, email, minLength, compose } from '@/utils/validation';
import { useAppDispatch } from '@/app/hooks';
import { createUser, updateUser } from './usersSlice';
import { User, UserRole } from '@/types';

interface UserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserFormValues {
  name: string;
  email: string;
  role: UserRole;
}

export const UserDialog: FC<UserDialogProps> = ({
  open,
  user,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const initialValues: UserFormValues = {
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'reviewer',
  };

  const form = useFormValidation<UserFormValues>({
    initialValues,
    validators: {
      name: [compose([required(), minLength(2, 'Name must be at least 2 characters')])],
      email: [compose([required(), email()])],
      role: [required()],
    },
    options: {
      trimOnBlurFields: ['name', 'email'],
    },
  });

  useEffect(() => {
    if (open) {
      form.resetForm(initialValues);
    }
  }, [open, user]);

  const handleSave = async () => {
    if (!form.validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (user) {
        await dispatch(updateUser({ ...form.values, id: user.id })).unwrap();
      } else {
        await dispatch(createUser(form.values)).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <FieldText
          name="name"
          label="Name"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errorMessage={form.errors.name}
          touched={form.touched.name}
          margin="normal"
          autoFocus
        />

        <FieldText
          name="email"
          label="Email"
          type="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errorMessage={form.errors.email}
          touched={form.touched.email}
          margin="normal"
        />

        <FieldText
          name="role"
          label="Role"
          select
          value={form.values.role}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errorMessage={form.errors.role}
          touched={form.touched.role}
          margin="normal"
        >
          <MenuItem value="reviewer">Reviewer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </FieldText>

        <FormActions
          onSave={handleSave}
          onCancel={onClose}
          disabled={loading}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};
