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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { AutoResponse } from "../utils/store";

interface Props {
  rows: AutoResponse[];
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function ResponseTable({ rows, onEdit, onToggle }: Props) {
  if (!rows.length) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        🤖 Aún no tienes autorespuestas
      </Paper>
    );
  }

  return (
    <Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Canal</TableCell>
            <TableCell>Condición</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id} hover>
              <TableCell>{row.name}</TableCell>

              <TableCell sx={{ textTransform: "capitalize" }}>
                {row.channel}
              </TableCell>

              <TableCell>
                {row.condition} <b>{row.keyword}</b>
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={row.active ? "Activo" : "Pausado"}
                  color={row.active ? "success" : "default"}
                />
              </TableCell>

              <TableCell align="right">
                <IconButton onClick={() => onEdit(row.id)}>
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton onClick={() => onToggle(row.id)}>
                  {row.active ? (
                    <PauseIcon fontSize="small" />
                  ) : (
                    <PlayArrowIcon fontSize="small" />
                  )}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
