"use client";

import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { MediaFile } from "../types/file";

interface Props {
  label?: string;
  value?: MediaFile | null;
  options: MediaFile[];
  accept?: string;
  disabled?: boolean;
  onSelect: (file: MediaFile) => void;
  onUpload: (file: MediaFile) => void;
}

export default function FilePicker({
  label = "Archivo",
  value,
  options,
  accept,
  disabled,
  onSelect,
  onUpload,
}: Props) {
  return (
    <Stack spacing={1.5}>
      <Typography fontSize={13} color="text.secondary">
        {label}
      </Typography>

      <Stack direction="row" spacing={1}>
        {/* UPLOAD */}
        <Button
          variant="outlined"
          size="small"
          component="label"
          startIcon={<UploadIcon />}
          disabled={disabled}
        >
          Subir archivo
          <input
            type="file"
            hidden
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const tempFile: MediaFile = {
                id: crypto.randomUUID(),
                name: file.name,
                url: URL.createObjectURL(file), // 👈 preview inmediato
                type: detectType(file.type),
                isTemp: true,
              };

              onUpload(tempFile);
            }}
          />
        </Button>

        {/* SELECT EXISTENTE */}
        <Select
          size="small"
          fullWidth
          displayEmpty
          disabled={disabled}
          value={value?.id ?? ""}
          onChange={(e) => {
            const selected = options.find(o => o.id === e.target.value);
            if (selected) onSelect(selected);
          }}
        >
          <MenuItem value="">
            Seleccionar archivo existente
          </MenuItem>

          {options.map(file => (
            <MenuItem key={file.id} value={file.id}>
              {file.name}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {/* ===== PREVIEW ===== */}
      {value && (
        <Paper
          variant="outlined"
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "background.default",
          }}
        >
          <Preview file={value} />
        </Paper>
      )}
    </Stack>
  );
}

/* ================== HELPERS ================== */

function detectType(mime: string): MediaFile["type"] {
  if (mime.startsWith("image")) return "image";
  if (mime.startsWith("video")) return "video";
  if (mime.startsWith("audio")) return "audio";
  return "document";
}

/* ================== PREVIEW ================== */

function Preview({ file }: { file: MediaFile }) {
  switch (file.type) {
    case "image":
    case "sticker":
      return (
        <img
          src={file.url}
          alt={file.name}
          style={{
            width: "100%",
            maxHeight: 180,
            objectFit: "contain",
            borderRadius: 6,
          }}
        />
      );

    case "video":
      return (
        <video
          src={file.url}
          controls
          style={{ width: "100%", borderRadius: 6 }}
        />
      );

    case "audio":
      return (
        <audio src={file.url} controls style={{ width: "100%" }} />
      );

    default:
      return (
        <Typography fontSize={13}>
          📄 {file.name}
        </Typography>
      );
  }
}
