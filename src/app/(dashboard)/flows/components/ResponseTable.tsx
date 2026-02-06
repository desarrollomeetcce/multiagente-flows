"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BoltIcon from "@mui/icons-material/Bolt";
import ScheduleIcon from "@mui/icons-material/Schedule";

interface AutoResponse {
  id: string;
  name: string;
  channel?: string;
  condition?: string;
  keyword?: string;
  enabled: boolean;
  type?: "AUTO_RESPONSE" | "FOLLOW_UP";
}

interface Props {
  rows: AutoResponse[];
  loading?: boolean;
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function ResponseTable({
  rows,
  loading = false,
  onEdit,
  onToggle,
}: Props) {
  /* 🟡 Loading */
  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        {[...Array(5)].map((_, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ py: 1 }}
          >
            <Skeleton width={220} />
            <Skeleton width={120} />
            <Skeleton width={180} />
            <Skeleton width={80} />
            <Skeleton width={80} />
          </Stack>
        ))}
      </Paper>
    );
  }

  /* ⚪ Empty */
  if (!rows.length) {
    return (
      <Paper
        sx={{
          p: 5,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="h6" gutterBottom>
          🤖 No hay respuestas configuradas
        </Typography>
        <Typography variant="body2">
          Crea una autorespuesta o follow-up para empezar a automatizar.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Condición</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              sx={{
                "&:last-child td": { borderBottom: 0 },
              }}
            >
              {/* Nombre */}
              <TableCell>
                <Typography fontWeight={500}>{row.name}</Typography>
              </TableCell>

              {/* Tipo */}
              <TableCell>
                <Chip
                  size="small"
                  icon={
                    row.type === "FOLLOW_UP" ? (
                      <ScheduleIcon />
                    ) : (
                      <BoltIcon />
                    )
                  }
                  label={
                    row.type === "FOLLOW_UP"
                      ? "Follow-up"
                      : "Autorespuesta"
                  }
                  color={
                    row.type === "FOLLOW_UP" ? "secondary" : "primary"
                  }
                  variant="outlined"
                />
              </TableCell>

              {/* Condición */}
              <TableCell>
                <Typography variant="body2">
                  {row.condition}
                  {row.keyword && (
                    <>
                      {" "}
                      <b>{row.keyword}</b>
                    </>
                  )}
                </Typography>
              </TableCell>

              {/* Estado */}
              <TableCell>
                <Chip
                  size="small"
                  label={row.enabled ? "Activo" : "Pausado"}
                  color={row.enabled ? "success" : "default"}
                  variant={row.enabled ? "filled" : "outlined"}
                />
              </TableCell>

              {/* Acciones */}
              <TableCell align="right">
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(row.id)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title={row.enabled ? "Pausar" : "Activar"}
                >
                  <IconButton
                    size="small"
                    onClick={() => onToggle(row.id)}
                  >
                    {row.enabled ? (
                      <PauseIcon fontSize="small" />
                    ) : (
                      <PlayArrowIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
