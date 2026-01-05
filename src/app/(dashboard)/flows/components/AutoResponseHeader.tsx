"use client";

import {
  Box,
  Switch,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import { ResponseType } from "../utils/types";

interface Props {
  name: string;
  onChange: (v: string) => void;
  enabled: boolean;
  onToggle: (v: boolean) => void;

  // 🔥 opcionales
  title?: string;
  subtitle?: string;
  type?: ResponseType;
}

export default function AutoResponseHeader({
  name,
  onChange,
  enabled,
  onToggle,
  title,
  subtitle,
  type = "AUTO_RESPONSE",
}: Props) {
  const label =
    title ??
    (type === "FOLLOW_UP"
      ? "Nombre del Follow Up"
      : "Nombre del Auto Atención");

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      mb={3}
      padding={2}
    >
      {/* TÍTULO OPCIONAL */}
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <TextField
          label={label}
          fullWidth
          value={name}
          onChange={e => onChange(e.target.value)}
        />

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            size="small"
            color={enabled ? "success" : "default"}
            label={enabled ? "Activo" : "Pausado"}
          />

          <Switch
            checked={enabled}
            onChange={e => onToggle(e.target.checked)}
            color="success"
          />
        </Box>
      </Box>
    </Box>
  );
}
