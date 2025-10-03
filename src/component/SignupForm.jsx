import React from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DynamicField from './DynamicField';
import rawSchema from '../schema/signupSchema.json';

const UI_CONFIG = {
  title: 'Signup',
  storageKey: 'signupFormData',
  submitLabel: 'Sign Up'
};

function normalizeFields(dataArray) {
  const toOptions = (list) => (list || []).map((label, idx) => ({ label, value: String(idx + 1) }));
  return (dataArray || []).map((item) => {
    const type = item.fieldType;
    return {
      name: item.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '').replace(/^([0-9])/, '_$1').charAt(0).toLowerCase() + item.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '').replace(/^([0-9])/, '_$1').slice(1),
      label: item.name,
      type,
      required: !!item.required,
      minLength: item.minLength,
      maxLength: item.maxLength,
      options: type === 'LIST' || type === 'RADIO' ? toOptions(item.listOfValues1) : undefined,
      defaultValue: item.defaultValue ?? ''
    };
  });
}

function buildDefaultValues(fields) {
  const saved = (() => {
    try {
      const raw = localStorage.getItem(UI_CONFIG.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  const defaults = (fields || []).reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? '';
    return acc;
  }, {});

  return { ...defaults, ...(saved || {}) };
}

export default function SignupForm() {
  const fields = React.useMemo(() => normalizeFields(rawSchema.data), []);
  const defaultValues = React.useMemo(() => buildDefaultValues(fields), [fields]);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm({ defaultValues, mode: 'onBlur' });

  const onSubmit = (data) => {
    try {
      localStorage.setItem(UI_CONFIG.storageKey, JSON.stringify(data));
    } catch (e) {
      // ignore storage errors in this simple demo
    }
  };

  const onClear = () => {
    try {
      localStorage.removeItem(UI_CONFIG.storageKey);
    } catch (e) {}
    const newDefaults = (fields || []).reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? '';
      return acc;
    }, {});
    reset(newDefaults);
  };

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', my: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {UI_CONFIG.title}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {(fields || []).map((field) => (
              <Grid item xs={12} key={field.name}>
                <DynamicField field={field} control={control} errors={errors} />
              </Grid>
            ))}
            <Grid item xs={12} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {UI_CONFIG.submitLabel}
              </Button>
              <Button type="button" variant="outlined" color="secondary" onClick={onClear}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}


