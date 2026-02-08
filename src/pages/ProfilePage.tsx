import { FC, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { FieldText } from '@/components/form/FieldText';
import { FormActions } from '@/components/form/FormActions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { required, email, minLength, compose } from '@/utils/validation';
import { useAppSelector } from '@/app/hooks';

interface ProfileFormValues {
  name: string;
  email: string;
  role: string;
}

export const ProfilePage: FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const initialValues: ProfileFormValues = {
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
  };

  const form = useFormValidation<ProfileFormValues>({
    initialValues,
    validators: {
      name: [compose([required(), minLength(2, 'Name must be at least 2 characters')])],
      email: [compose([required(), email()])],
    },
    options: {
      trimOnBlurFields: ['name', 'email'],
    },
  });

  const handleSave = async () => {
    if (!form.validateForm()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleCancel = () => {
    form.resetForm();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, mt: 3 }}>
        <FieldText
          name="name"
          label="Name"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errorMessage={form.errors.name}
          touched={form.touched.name}
          margin="normal"
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
          value={form.values.role}
          onChange={() => {}}
          onBlur={() => {}}
          margin="normal"
          disabled
          helperText="Role cannot be changed"
        />

        <FormActions
          onSave={handleSave}
          onCancel={handleCancel}
          disabled={loading}
          loading={loading}
        />
      </Paper>
    </Container>
  );
};
