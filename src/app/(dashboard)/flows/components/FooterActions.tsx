"use client";

import { Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";

interface Props {
  disabled?: boolean;
  onSave: () => Promise<void>; // 🔥 async
  onCancel?: () => void;
}

export default function FooterActions({
  disabled,
  onSave,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (loading) return;

    try {
      setLoading(true);
      await onSave(); // 👈 esperamos el async externo
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        color="inherit"
        onClick={onCancel}
        disabled={loading}
      >
        Cancelar
      </Button>

      <Button
        variant="contained"
        color="success"
        disabled={disabled || loading}
        onClick={handleSave}
        startIcon={
          loading ? (
            <CircularProgress
              size={18}
              color="inherit"
            />
          ) : undefined
        }
      >
        {loading ? "Guardando..." : "Guardar"}
      </Button>
    </Box>
  );
}
