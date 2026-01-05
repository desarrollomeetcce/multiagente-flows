"use client";

import {
  Box,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import { Action } from "../utils/types";

interface Props {
  actions: Action[];
}

export default function WhatsAppPreview({ actions }: Props) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 24,
      }}
    >
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
        <Box
          sx={{
            p: 1.5,
            backgroundColor: "#075E54",
            color: "#fff",
          }}
        >
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
function TextBubble({ text }: { text?: string }) {
  if (!text) return null;
  return <Bubble>{text}</Bubble>;
}


function ImageBubble({
  file,
  caption,
}: {
  file?: any;
  caption?: string;
}) {
  if (!file) return null;

  return (
    <Bubble>
      <img
        src={file.url}
        alt={file.name}
        style={{
          width: "100%",
          borderRadius: 6,
          marginBottom: caption ? 6 : 0,
        }}
      />
      {caption && <div>{caption}</div>}
    </Bubble>
  );
}


function VideoBubble({ file }: { file?: any }) {
  if (!file) return null;

  return (
    <Bubble>
      <video
        src={file.url}
        controls
        style={{ width: "100%", borderRadius: 6 }}
      />
    </Bubble>
  );
}

function AudioBubble({ file }: { file?: any }) {
  if (!file) return null;

  return (
    <Bubble>
      <audio src={file.url} controls style={{ width: "100%" }} />
    </Bubble>
  );
}


function DocumentBubble({ file }: { file?: any }) {
  if (!file) return null;

  return (
    <Bubble>
      <Typography fontSize={12}>
        📄 {file.name}
      </Typography>
    </Bubble>
  );
}


function StickerBubble({ file }: { file?: any }) {
  if (!file) return null;

  return (
    <Box
      sx={{
        ml: "auto",
        mb: 1.5,
      }}
    >
      <img
        src={file.url}
        alt={file.name}
        style={{ width: 120 }}
      />
    </Box>
  );
}


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
