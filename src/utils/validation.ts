export type ValidatorFn = (value: any) => string | null;

export const required = (message = 'This field is required'): ValidatorFn => {
  return (value: any) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    return null;
  };
};

export const minLength = (min: number, message?: string): ValidatorFn => {
  return (value: any) => {
    if (value && value.length < min) {
      return message || `Minimum length is ${min} characters`;
    }
    return null;
  };
};

export const maxLength = (max: number, message?: string): ValidatorFn => {
  return (value: any) => {
    if (value && value.length > max) {
      return message || `Maximum length is ${max} characters`;
    }
    return null;
  };
};

export const email = (message = 'Invalid email address'): ValidatorFn => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value: any) => {
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return null;
  };
};

export const pattern = (regex: RegExp, message = 'Invalid format'): ValidatorFn => {
  return (value: any) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  };
};

export const compose = (validators: ValidatorFn[]): ValidatorFn => {
  return (value: any) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return null;
  };
};
