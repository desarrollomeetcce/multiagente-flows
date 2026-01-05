"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Stack,
  Divider,
} from "@mui/material";

import AutoResponseHeader from "../../components/AutoResponseHeader";
import ActivationSection from "../../components/ActivationSection";
import ActionSection from "../../components/ActionSection";
import RulesSection from "../../components/RulesSection";
import FooterActions from "../../components/FooterActions";
import WhatsAppPreview from "../../components/WhatsAppPreview";

import { Activation, Action, Rules, ResponseType } from "../../utils/types";

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
            <FooterActions disabled={!enabled} />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
