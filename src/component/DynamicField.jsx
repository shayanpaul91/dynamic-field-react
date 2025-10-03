import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

function buildRules(field) {
  const rules = {};
  if (field.required) {
    rules.required = `${field.label} is required`;
  }
  if (typeof field.minLength === 'number') {
    rules.minLength = { value: field.minLength, message: `${field.label} must be at least ${field.minLength} characters` };
  }
  if (typeof field.maxLength === 'number') {
    rules.maxLength = { value: field.maxLength, message: `${field.label} must be at most ${field.maxLength} characters` };
  }
  return rules;
}

export default function DynamicField({ field, control, errors }) {
  const rules = buildRules(field);

  if (field.type === 'TEXT') {
    return (
      <Controller
        name={field.name}
        control={control}
        rules={rules}
        render={({ field: rhfField }) => (
          <TextField
            {...rhfField}
            fullWidth
            label={field.label}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
          />
        )}
      />
    );
  }

  if (field.type === 'LIST') {
    return (
      <Controller
        name={field.name}
        control={control}
        rules={rules}
        render={({ field: rhfField }) => (
          <FormControl fullWidth error={!!errors[field.name]}>
            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.name}-label`}
              label={field.label}
              value={rhfField.value ?? ''}
              onChange={rhfField.onChange}
              onBlur={rhfField.onBlur}
              inputProps={{ name: field.name, id: `${field.name}-select` }}
            >
              {(field.options || []).map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors[field.name]?.message}</FormHelperText>
          </FormControl>
        )}
      />
    );
  }

  if (field.type === 'RADIO') {
    return (
      <Controller
        name={field.name}
        control={control}
        rules={rules}
        render={({ field: rhfField }) => (
          <FormControl error={!!errors[field.name]}>
            <RadioGroup
              row
              value={rhfField.value ?? ''}
              onChange={rhfField.onChange}
              onBlur={rhfField.onBlur}
              name={field.name}
            >
              {(field.options || []).map(opt => (
                <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
              ))}
            </RadioGroup>
            <FormHelperText>{errors[field.name]?.message}</FormHelperText>
          </FormControl>
        )}
      />
    );
  }

  // Fallback: render as text
  return (
    <Controller
      name={field.name}
      control={control}
      rules={rules}
      render={({ field: rhfField }) => (
        <TextField
          {...rhfField}
          fullWidth
          label={field.label}
          error={!!errors[field.name]}
          helperText={errors[field.name]?.message}
        />
      )}
    />
  );
}


