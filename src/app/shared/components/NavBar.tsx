"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";

export default function FlowsNavbar() {
  const router = useRouter();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="default"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        {/* ===== TITLE ===== */}
        <Typography
          fontWeight={700}
          fontSize={18}
          sx={{ cursor: "pointer" }}
          onClick={() => router.push("/flows")}
        >
          Automatizaciones
        </Typography>

        {/* ===== SPACER ===== */}
        <Box flex={1} />

        {/* ===== ACTIONS ===== */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ListAltIcon />}
            onClick={() => router.push("/flows")}
          >
            Lista de flujos
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/")}
          >
            Crear Follow up / Respuesta
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
