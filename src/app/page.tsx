"use client";

import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ScheduleIcon from "@mui/icons-material/Schedule";

const MotionBox = motion(Box);

export default function ResponsesHomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box py={10}>
        {/* ================= HEADER ================= */}
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          mb={8}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            letterSpacing={-0.6}
          >
            Automatizaciones
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            mt={2}
            maxWidth={560}
          >
            Define cómo y cuándo tu sistema responde o da seguimiento
            automáticamente a tus contactos.
          </Typography>
        </MotionBox>

        {/* ================= OPTIONS ================= */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={6}
          alignItems="stretch"
        >
          {/* ================= AUTO RESPONSE ================= */}
          <MotionBox
            whileHover={{ y: -4 }}
            sx={{
              flex: 1,
              p: 5,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ICON (CENTRADO) */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                backgroundColor: "success.light",
                color: "success.dark",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <FlashOnIcon sx={{ fontSize: 40 }} />
            </Box>

            {/* CONTENT */}
            <Box flex={1}>
              <Box textAlign="center" mb={2}>
                <Chip
                  label="Respuesta inmediata"
                  color="success"
                  size="small"
                />
              </Box>

              <Typography
                variant="h6"
                fontWeight={600}
                textAlign="center"
              >
                Autorespuesta
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1.5}
                textAlign="center"
              >
                Responde automáticamente en el momento exacto en que un cliente
                interactúa contigo.
              </Typography>

              <Stack spacing={0.75} mt={3} alignItems="center">
                <Typography variant="body2">Mensajes entrantes</Typography>
                <Typography variant="body2">Palabras clave</Typography>
                <Typography variant="body2">Atención inicial</Typography>
              </Stack>
            </Box>

            {/* CTA */}
            <Box mt={5}>
              <Button
                variant="outlined"
                color="success"
                fullWidth
                size="large"
                onClick={() => router.push("/flows/new")}
              >
                Crear autorespuesta
              </Button>
            </Box>
          </MotionBox>

          {/* ================= FOLLOW UP ================= */}
          <MotionBox
            whileHover={{ y: -4 }}
            sx={{
              flex: 1,
              p: 5,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ICON (CENTRADO) */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                backgroundColor: "primary.light",
                color: "primary.dark",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <ScheduleIcon sx={{ fontSize: 40 }} />
            </Box>

            {/* CONTENT */}
            <Box flex={1}>
              <Box textAlign="center" mb={2}>
                <Chip
                  label="Seguimiento programado"
                  color="primary"
                  size="small"
                />
              </Box>

              <Typography
                variant="h6"
                fontWeight={600}
                textAlign="center"
              >
                Follow Up
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1.5}
                textAlign="center"
              >
                Envía mensajes de seguimiento después de eventos definidos,
                como etiquetas o cambios de estado.
              </Typography>

              <Stack spacing={0.75} mt={3} alignItems="center">
                <Typography variant="body2">Basado en etiquetas</Typography>
                <Typography variant="body2">Con tiempo de espera</Typography>
                <Typography variant="body2">Recordatorios y cierres</Typography>
              </Stack>
            </Box>

            {/* CTA */}
            <Box mt={5}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() =>
                  router.push("/flows/new?type=follow-up")
                }
              >
                Crear follow up
              </Button>
            </Box>
          </MotionBox>
        </Stack>
      </Box>
    </Container>
  );
}
