"use client";

import { Autocomplete, TextField, Chip } from "@mui/material";

export interface TagOption {
  id: string;
  name: string;
}

interface Props {
  label?: string;
  value: TagOption[];
  options: TagOption[];
  onChange: (tags: TagOption[]) => void;
  disabled?: boolean;
}

export default function TagMultiSelect({
  label = "Etiquetas",
  value,
  options,
  onChange,
  disabled,
}: Props) {
  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      disableCloseOnSelect
      disabled={disabled}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.id}
            label={option.name}
            size="small"
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Buscar etiqueta..."
          size="small"
        />
      )}
    />
  );
}
