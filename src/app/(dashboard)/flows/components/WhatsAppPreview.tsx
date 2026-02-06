"use client";

import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Action } from "../utils/types";

// 🔥 cache global por URL
const loadedMediaCache = new Set<string>();

interface Props {
  actions: Action[];
}

export default function WhatsAppPreview({ actions }: Props) {
  return (
    <Box sx={{ position: "sticky", top: 24 }}>
      <Paper
        elevation={3}
        sx={{
          width: 340,
          height: "calc(100vh - 160px)",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box sx={{ p: 1.5, backgroundColor: "#075E54", color: "#fff" }}>
          <Typography fontWeight={600} fontSize={14}>
            WhatsApp
          </Typography>
          <Typography fontSize={12} sx={{ opacity: 0.8 }}>
            Vista previa
          </Typography>
        </Box>

        {/* Chat */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            backgroundColor: "#0b141a",
            overflowY: "auto",
          }}
        >
          {actions.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              No hay acciones para mostrar
            </Typography>
          )}

          {actions.map((action, index) => (
            <PreviewAction key={action.id ?? index} action={action} />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

/* ================= ACTION ROUTER ================= */

function PreviewAction({ action }: { action: Action }) {
  switch (action.type) {
    case "send_text":
      return <TextBubble text={action.text} />;

    case "send_image":
      return <ImageBubble file={action.file} caption={action.text} />;

    case "send_video":
      return <VideoBubble file={action.file} />;

    case "send_audio":
      return <AudioBubble file={action.file} />;

    case "send_document":
      return <DocumentBubble file={action.file} />;

    case "sticker":
      return <StickerBubble file={action.file} />;

    case "delay":
      return <DelayBubble seconds={action.delaySeconds} />;

    case "add_tag":
      return <TagBubble label="Agregar etiqueta" />;

    case "remove_tag":
      return <TagBubble label="Remover etiqueta" />;

    default:
      return null;
  }
}

/* ================= BASE BUBBLE ================= */

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: "80%",
        ml: "auto",
        mb: 1.5,
        p: 1.2,
        borderRadius: 2,
        backgroundColor: "#005c4b",
        color: "#fff",
        fontSize: 13,
        lineHeight: 1.4,
      }}
    >
      {children}
    </Box>
  );
}

/* ================= TEXT ================= */

function TextBubble({ text }: { text?: string }) {
  if (!text) return null;
  return <Bubble>{text}</Bubble>;
}

/* ================= IMAGE ================= */

function ImageBubble({
  file,
  caption,
}: {
  file?: any;
  caption?: string;
}) {
  const alreadyLoaded = file?.url && loadedMediaCache.has(file.url);
  const [loading, setLoading] = useState(!alreadyLoaded);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file?.url) return;

    setError(false);
    setLoading(!loadedMediaCache.has(file.url));
  }, [file?.url]);

  if (!file) return null;

  return (
    <Bubble>
      <Box
        sx={{
          position: "relative",
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && !error && <CircularProgress size={22} />}

        {!error && (
          <img
            src={file.url}
            alt={file.name}
            onLoad={() => {
              loadedMediaCache.add(file.url);
              setLoading(false);
            }}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            style={{
              display: loading ? "none" : "block",
              width: "100%",
              borderRadius: 6,
              marginBottom: caption ? 6 : 0,
            }}
          />
        )}

        {error && (
          <Typography fontSize={12} color="error">
            No se pudo cargar la imagen
          </Typography>
        )}
      </Box>

      {caption && <div>{caption}</div>}
    </Bubble>
  );
}

/* ================= VIDEO ================= */

function VideoBubble({ file }: { file?: any }) {
  const alreadyLoaded = file?.url && loadedMediaCache.has(file.url);
  const [loading, setLoading] = useState(!alreadyLoaded);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file?.url) return;

    setError(false);
    setLoading(!loadedMediaCache.has(file.url));
  }, [file?.url]);

  if (!file) return null;

  return (
    <Bubble>
      <Box
        sx={{
          position: "relative",
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && !error && <CircularProgress size={22} />}

        {!error && (
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
              setError(true);
            }}
            style={{
              display: loading ? "none" : "block",
              width: "100%",
              borderRadius: 6,
            }}
          />
        )}

        {error && (
          <Typography fontSize={12} color="error">
            No se pudo cargar el video
          </Typography>
        )}
      </Box>
    </Bubble>
  );
}

/* ================= AUDIO ================= */

function AudioBubble({ file }: { file?: any }) {
  const alreadyLoaded = file?.url && loadedMediaCache.has(file.url);
  const [loading, setLoading] = useState(!alreadyLoaded);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file?.url) return;

    setError(false);
    setLoading(!loadedMediaCache.has(file.url));
  }, [file?.url]);

  if (!file) return null;

  return (
    <Bubble>
      <Box
        sx={{
          position: "relative",
          minHeight: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && !error && <CircularProgress size={20} />}

        {!error && (
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
              setError(true);
            }}
            style={{
              display: loading ? "none" : "block",
              width: "100%",
            }}
          />
        )}

        {error && (
          <Typography fontSize={12} color="error">
            No se pudo cargar el audio
          </Typography>
        )}
      </Box>
    </Bubble>
  );
}

/* ================= DOCUMENT ================= */

function DocumentBubble({ file }: { file?: any }) {
  if (!file) return null;

  return (
    <Bubble>
      <Typography fontSize={12}>📄 {file.name}</Typography>
    </Bubble>
  );
}

/* ================= STICKER ================= */

function StickerBubble({ file }: { file?: any }) {
  const alreadyLoaded = file?.url && loadedMediaCache.has(file.url);
  const [loading, setLoading] = useState(!alreadyLoaded);

  useEffect(() => {
    if (!file?.url) return;
    setLoading(!loadedMediaCache.has(file.url));
  }, [file?.url]);

  if (!file) return null;

  return (
    <Box
      sx={{
        ml: "auto",
        mb: 1.5,
        width: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading && <CircularProgress size={22} />}

      <img
        src={file.url}
        alt={file.name}
        onLoad={() => {
          loadedMediaCache.add(file.url);
          setLoading(false);
        }}
        style={{
          display: loading ? "none" : "block",
          width: 120,
        }}
      />
    </Box>
  );
}

/* ================= OTHERS ================= */

function DelayBubble({ seconds }: { seconds?: number }) {
  if (!seconds) return null;

  return (
    <Box textAlign="center" mb={1.5}>
      <Chip
        size="small"
        label={`⏱ Esperar ${seconds}s`}
        sx={{ backgroundColor: "#1f2933", color: "#9ca3af" }}
      />
    </Box>
  );
}

function TagBubble({ label }: { label: string }) {
  return (
    <Box textAlign="center" mb={1.5}>
      <Chip
        size="small"
        label={label}
        sx={{ backgroundColor: "#1f2933", color: "#9ca3af" }}
      />
    </Box>
  );
}
