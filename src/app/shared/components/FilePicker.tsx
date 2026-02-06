"use client";

import {
  Box,
  Button,
  MenuItem,
  Typography,
  Stack,
  Paper,
  TextField,
  Popover,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useEffect, useMemo, useState } from "react";
import { MediaFile } from "../types/file";

const CHUNK_SIZE = 30;

interface Props {
  label?: string;
  value?: MediaFile | null;
  options: MediaFile[];
  accept?: string;
  disabled?: boolean;
  onSelect: (file: MediaFile) => void;
  onUpload: (file: MediaFile) => void;
}
const loadedMediaCache = new Set<string>();

export default function FilePicker({
  label = "Archivo",
  value,
  options,
  accept,
  disabled,
  onSelect,
  onUpload,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);

  const open = Boolean(anchorEl);

  /* ================== FILTER ================== */
  const filteredOptions = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return options;
    return options.filter(o => o.name.toLowerCase().includes(s));
  }, [search, options]);

  const visibleOptions = filteredOptions.slice(0, visibleCount);

  /* ================== SCROLL ================== */
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setVisibleCount(v =>
        Math.min(v + CHUNK_SIZE, filteredOptions.length)
      );
    }
  }

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
                url: URL.createObjectURL(file),
                type: detectType(file.type),
                isTemp: true,
              };

              onUpload(tempFile);
            }}
          />
        </Button>

        {/* OPEN MENU */}
        <Button
          variant="outlined"
          size="small"
          fullWidth
          disabled={disabled}
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setVisibleCount(CHUNK_SIZE);
          }}
        >
          {value ? value.name : "Seleccionar archivo existente"}
        </Button>
      </Stack>

      {/* ===== POPOVER ===== */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            width: anchorEl?.clientWidth || 320,
            maxHeight: 360,
            borderRadius: 2,
          },
        }}
        disableRestoreFocus
      >
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Stack spacing={1} sx={{ p: 1 }}>
            <TextField
              size="small"
              placeholder="Buscar archivo…"
              autoFocus
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(CHUNK_SIZE);
              }}
            />

            <Box sx={{ maxHeight: 260, overflow: "auto" }} onScroll={handleScroll}>
              {visibleOptions.map(file => (
                <MenuItem
                  key={file.id}
                  selected={value?.id === file.id}
                  onClick={() => {
                    onSelect(file);
                    setAnchorEl(null);
                  }}
                >
                  {file.name}
                </MenuItem>
              ))}

              {visibleCount < filteredOptions.length && (
                <Typography fontSize={12} align="center" sx={{ py: 1 }}>
                  Cargando más…
                </Typography>
              )}

              {filteredOptions.length === 0 && (
                <Typography fontSize={12} align="center" sx={{ py: 2 }}>
                  Sin resultados
                </Typography>
              )}
            </Box>
          </Stack>
        </ClickAwayListener>
      </Popover>

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
  const alreadyLoaded =
    file.url && loadedMediaCache.has(file.url);

  const [loading, setLoading] = useState(!alreadyLoaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    if (file.type === "document") {
      setLoading(false);
      return;
    }

    if (file.url && loadedMediaCache.has(file.url)) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [file.url, file.type]);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading && !error && <CircularProgress size={28} />}

      {error && (
        <Typography fontSize={13} color="error">
          {error}
        </Typography>
      )}

      {(file.type === "image" || file.type === "sticker") && (
        <img
          src={file.url}
          alt={file.name}
          onLoad={() => {
            loadedMediaCache.add(file.url);
            setLoading(false);
          }}
          onError={() => {
            setLoading(false);
            setError("No se pudo cargar la imagen.");
          }}
          style={{
            display: loading || !!error ? "none" : "block",
            width: "100%",
            maxHeight: 180,
            objectFit: "contain",
            borderRadius: 6,
          }}
        />
      )}

      {file.type === "video" && (
        <video
          src={file.url}
          controls
          preload="metadata"
          onLoadedData={() => {
            loadedMediaCache.add(file.url);
            setLoading(false);
          }}
          onError={() => {
            setLoading(false);
            setError("No se pudo cargar el video.");
          }}
          style={{
            display: loading || !!error ? "none" : "block",
            width: "100%",
            borderRadius: 6,
          }}
        />
      )}

      {file.type === "audio" && (
        <audio
          src={file.url}
          controls
          preload="metadata"
          onLoadedData={() => {
            loadedMediaCache.add(file.url);
            setLoading(false);
          }}
          onError={() => {
            setLoading(false);
            setError("No se pudo cargar el audio.");
          }}
          style={{
            display: loading || !!error ? "none" : "block",
            width: "100%",
          }}
        />
      )}

      {file.type === "document" && (
        <Typography fontSize={13}>📄 {file.name}</Typography>
      )}
    </Box>
  );
}

