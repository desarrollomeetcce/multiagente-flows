"use client";


import { useEffect, useState } from "react";
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
import { normalizeResponseForDB } from "../../utils/normalizeResponse";
import { createResponse } from "../../application/responses.repository";
import { SessionsService, UserSession } from "@/app/shared/services/sessions.service";

export default function NewAutoResponsePage() {
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
  const [responseId] = useState(() => crypto.randomUUID());
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

  useEffect(() => {
    SessionsService.getAll()
      .then(setSessions)
      .catch(err => {
        console.error("Error cargando sesiones", err);
      });
  }, []);


  async function handleSave() {
    if (!name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const payload = buildResponsePayload();
    const normalized = normalizeResponseForDB(payload);

    try {
      await createResponse(normalized);
      console.log("Response guardada");
      // aquí luego puedes hacer router.push(...)
    } catch (err) {
      console.error("Error guardando response", err);
      alert("Ocurrió un error al guardar");
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
                  />

                  <ActionSection
                    disabled={!enabled}
                    actions={actions}
                    setActions={setActions}
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
