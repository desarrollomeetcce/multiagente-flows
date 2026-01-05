import { Box, Button } from "@mui/material";

export default function FooterActions({ disabled }: { disabled?: boolean }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Button color="inherit">
        Cancelar
      </Button>

      <Button
        variant="contained"
        color="success"
        disabled={disabled}
      >
        Guardar
      </Button>
    </Box>
  );
}

