import { useState, useCallback, ChangeEvent, FocusEvent } from 'react';
import { ValidatorFn } from '@/utils/validation';

export interface FormConfig<T> {
  initialValues: T;
  validators?: Partial<Record<keyof T, ValidatorFn[]>>;
  options?: {
    trimOnBlurFields?: (keyof T)[];
  };
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  lastValidated: Partial<Record<keyof T, any>>;
}

export interface FormHelpers<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  setValue: (name: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validateField: (name: keyof T) => string | null;
  validateForm: () => boolean;
  resetForm: (nextValues?: T) => void;
}

export function useFormValidation<T extends Record<string, any>>(
  config: FormConfig<T>
): FormHelpers<T> {
  const [state, setState] = useState<FormState<T>>({
    values: config.initialValues,
    errors: {},
    touched: {},
    lastValidated: {},
  });

  const validateFieldInternal = useCallback(
    (name: keyof T, value: any): string | null => {
      const validators = config.validators?.[name];
      if (!validators || validators.length === 0) {
        return null;
      }

      for (const validator of validators) {
        const error = validator(value);
        if (error) {
          return error;
        }
      }
      return null;
    },
    [config.validators]
  );

  const validateField = useCallback(
    (name: keyof T): string | null => {
      return validateFieldInternal(name, state.values[name]);
    },
    [validateFieldInternal, state.values]
  );

  const setValue = useCallback((name: keyof T, value: any) => {
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
    }));
  }, []);

  const setValues = useCallback((values: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        ...values,
      },
    }));
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setState((prev) => {
        const newValues = {
          ...prev.values,
          [name]: value,
        };
        
        const newErrors = { ...prev.errors };
        if (prev.touched[name as keyof T]) {
          const error = validateFieldInternal(name as keyof T, value);
          if (error) {
            newErrors[name as keyof T] = error;
          } else {
            delete newErrors[name as keyof T];
          }
        }

        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          lastValidated: {
            ...prev.lastValidated,
            [name]: !newErrors[name as keyof T] ? value : prev.lastValidated[name as keyof T],
          },
        };
      });
    },
    [validateFieldInternal]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      let value = e.target.value;

      setState((prev) => {
        if (config.options?.trimOnBlurFields?.includes(name as keyof T)) {
          value = value.trim();
        }

        // Skip validation if already validated successfully
        if (prev.lastValidated[name as keyof T] === value) {
          return {
            ...prev,
            values: {
              ...prev.values,
              [name]: value,
            },
            touched: {
              ...prev.touched,
              [name]: true,
            },
          };
        }

        const error = validateFieldInternal(name as keyof T, value);
        
        return {
          ...prev,
          values: {
            ...prev.values,
            [name]: value,
          },
          touched: {
            ...prev.touched,
            [name]: true,
          },
          errors: error
            ? { ...prev.errors, [name]: error }
            : (() => {
                const newErrors = { ...prev.errors };
                delete newErrors[name as keyof T];
                return newErrors;
              })(),
          lastValidated: {
            ...prev.lastValidated,
            [name]: !error ? value : prev.lastValidated[name as keyof T],
          },
        };
      });
    },
    [config.options?.trimOnBlurFields, validateFieldInternal]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    const newTouched: Partial<Record<keyof T, boolean>> = {};

    for (const name in config.validators) {
      newTouched[name as keyof T] = true;
      const error = validateFieldInternal(name as keyof T, state.values[name as keyof T]);
      if (error) {
        newErrors[name as keyof T] = error;
      }
    }

    setState((prev) => ({
      ...prev,
      errors: newErrors,
      touched: newTouched,
    }));

    return Object.keys(newErrors).length === 0;
  }, [config.validators, state.values, validateFieldInternal]);

  const resetForm = useCallback((nextValues?: T) => {
    setState({
      values: nextValues || config.initialValues,
      errors: {},
      touched: {},
      lastValidated: {},
    });
  }, [config.initialValues]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    setValue,
    setValues,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
  };
}
