"use client";


import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Stack,
  Divider,
  Autocomplete,
  Chip,
  TextField,
} from "@mui/material";

import AutoResponseHeader from "../../components/AutoResponseHeader";
import ActivationSection from "../../components/ActivationSection";
import ActionSection from "../../components/ActionSection";
import RulesSection from "../../components/RulesSection";
import FooterActions from "../../components/FooterActions";
import WhatsAppPreview from "../../components/WhatsAppPreview";

import { Activation, Action, Rules, ResponseType } from "../../utils/types";
import { hydrateActionsFromDB, normalizeResponseForDB } from "../../utils/normalizeResponse";
import { createResponse, updateResponse } from "../../application/responses.repository";
import { SessionsService, UserSession } from "@/app/shared/services/sessions.service";
import { Tag } from "@/app/shared/services/tags.service";
import { getTagsAction } from "../../application/tags.actions";
import { FileItem } from "@/app/shared/services/files.service";
import { getbaseURL, getFilesAction } from "../../application/file.action";
import { MediaFile } from "@/app/shared/types/file";


interface Props {
  mode?: "create" | "edit";
  initialData?: any;
}



export interface BackendFile {
  id: number | string;
  name: string;
  path: string;
}
export type FileKind =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "sticker"


export function getFileTypeFromPath(path?: string): FileKind {
  if (!path) return "image";

  const ext = path.split(".").pop()?.toLowerCase();

  if (!ext) return "image";

  // 🖼 imágenes
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return "image";
  }

  // 🎥 video
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) {
    return "video";
  }

  // 🎧 audio
  if (["mp3", "wav", "ogg", "aac"].includes(ext)) {
    return "audio";
  }

  // 📄 documentos
  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
    return "document";
  }

  // 🧷 stickers (si los manejas así)
  if (["webp"].includes(ext)) {
    return "sticker";
  }

  return "image";
}

export function buildFileUrl(path: string) {
  // ejemplo típico
  return `/uploads/${encodeURIComponent(path)}`;

  // o si es externo:
  // return `https://cdn.tudominio.com/${path}`;
}


export function mapBackendFileToMediaFile(
  file: BackendFile,
  baseUrl: string
): MediaFile {
  const type = getFileTypeFromPath(file.path);

  return {
    id: String(file.id),
    name: file.name,
    url: `${baseUrl}/media/${file.path}`,
    type,
  };
}


export default function NewAutoResponsePage({
  mode = "create",
  initialData,
}: Props) {

  // 🔥 detectar tipo
  const searchParams = useSearchParams();
  const type: ResponseType =
    searchParams.get("type") === "follow-up"
      ? "FOLLOW_UP"
      : "AUTO_RESPONSE";

  const [enabled, setEnabled] = useState(true);
  const [name, setName] = useState("");
  const [activations, setActivations] = useState<Activation[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [rules, setRules] = useState<Rules>({
    noGroups: false,
    onlySchedule: false,
    ignoreIfOpen: false,
    ignoreIfArchived: false,
  });
  const isEdit = Boolean(initialData?.id);

  const responseId = useMemo(() => {
    return isEdit
      ? initialData!.id
      : crypto.randomUUID();
  }, [isEdit, initialData]);

  function buildResponsePayload() {
    return {
      id: responseId,
      name,
      type,
      enabled,
      sessions: selectedSessions, // 👈 NUEVO
      activations,
      actions,
      rules,
    };
  }

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const sessionLoadedRef = useRef(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const tagsLoadedRef = useRef(false);

  const filesLoadedRef = useRef(false);


  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  useEffect(() => {
    if (filesLoadedRef.current) return;
    filesLoadedRef.current = true;

    (async () => {
      const backendFiles = await getFilesAction();
      const baseUrl = await getbaseURL();
      const mapped = backendFiles
        .map(file => mapBackendFileToMediaFile(file, baseUrl))

      setMediaFiles(mapped);
    })();
  }, []);



  useEffect(() => {
    if (tagsLoadedRef.current) return;
    tagsLoadedRef.current = true;

    (async () => {
      const data = await getTagsAction();
      setTags(data);
    })();
  }, []);

  useEffect(() => {
    if (sessionLoadedRef.current) return;
    sessionLoadedRef.current = true;
    SessionsService.getAll()
      .then(setSessions)
      .catch(err => {
        console.error("Error cargando sesiones", err);
      });
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setEnabled(initialData.enabled);
      setActivations(initialData.activations);
      setActions(hydrateActionsFromDB(initialData.actions));
      setRules(initialData.rules);
      setSelectedSessions(
        initialData.sessions.map((s: any) => s.session)
      );
    }
  }, [mode, initialData]);

  async function handleSave() {
    const payload = normalizeResponseForDB(buildResponsePayload());

    try {
      if (mode === "edit") {
        await updateResponse(payload);
      } else {
        await createResponse(payload);
      }
    } catch (err) {
      console.error(err);
    }
  }



  return (
    <Container>
      <Box py={4}>
        <Paper
          elevation={3}
          sx={{
            mx: "auto",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {/* ================== CONTENT ================== */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 360px",
              gap: 3,
              maxWidth: "1600px",
              width: "100%",
              mx: "auto",
            }}
          >
            {/* ================== BUILDER ================== */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 160px)",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  pr: 1,
                  pt: 3,
                }}
              >
                <Stack spacing={4}>
                  <AutoResponseHeader
                    // 🔥 título cambia por tipo
                    title={type === "FOLLOW_UP" ? "Follow Up" : "Autorespuesta"}
                    subtitle={
                      type === "FOLLOW_UP"
                        ? "Envía mensajes de seguimiento basados en etiquetas"
                        : undefined
                    }
                    name={name}
                    onChange={setName}
                    enabled={enabled}
                    onToggle={setEnabled}
                  />

                  <Divider />
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    mb={3}
                    padding={2}
                  >
                    <Autocomplete
                      multiple
                      options={sessions}
                      getOptionLabel={(s) => s.name}
                      value={sessions.filter(s => selectedSessions.includes(s.sessionAuth))}
                      onChange={(_, value) => {
                        setSelectedSessions(value.map(v => v.sessionAuth));
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option.name}
                            {...getTagProps({ index })}
                            key={option.sessionAuth}
                            sx={{ backgroundColor: option.color || undefined }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sesiones"
                          placeholder="Selecciona sesiones"
                        />
                      )}
                    />
                  </Box>
                  <ActivationSection
                    disabled={!enabled}
                    activations={activations}
                    setActivations={setActivations}
                    // 🔥 clave
                    responseType={type}
                    tags={tags}
                  />

                  <ActionSection
                    disabled={!enabled}
                    actions={actions}
                    setActions={setActions}
                    tags={tags}
                    files={mediaFiles}
                  />

                  <RulesSection
                    disabled={!enabled}
                    rules={rules}
                    setRules={setRules}
                  />

                  <Box height={24} />
                </Stack>
              </Box>
            </Box>

            {/* ================== PREVIEW ================== */}
            <WhatsAppPreview actions={actions} />
          </Box>

          {/* ================== STICKY FOOTER ================== */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              zIndex: 10,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              p: 2,
              borderRadius: 2,
            }}
          >
            <FooterActions onSave={handleSave} disabled={!enabled} />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
