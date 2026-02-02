import { ChangeEvent, FocusEvent, FC } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface FieldTextProps extends Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur'> {
  name: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  touched?: boolean;
}

export const FieldText: FC<FieldTextProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  helperText,
  ...rest
}) => {
  const showError = touched && !!error;

  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={showError}
      helperText={showError ? error : helperText}
      fullWidth
      {...rest}
    />
  );
};
