"use client";

import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Activation } from "../utils/types";
import TagMultiSelect from "@/app/shared/components/TagMultiSelect";
import { Tag } from "@/app/shared/services/tags.service";
import { useEffect, useRef } from "react";

interface Props {
  activation: Activation;
  onChange: (a: Activation) => void;
  onDelete: () => void;
  disabled?: boolean;
  tags: Tag[]
}

function needsNormalization(activation: Activation) {
  return (
    !activation.delay &&
    !activation.tagOptions &&
    (
      (activation as any).delayDays != null ||
      (activation as any).delayHours != null ||
      (activation as any).delayMinutes != null ||
      Array.isArray((activation as any).tags)
    )
  );
}


function normalizeActivationIfNeeded(activation: Activation, tags: any[]): Activation {
  // 👇 ya viene normalizado
  if (activation.delay || activation.tagOptions) {
    return activation;
  }

  // 👇 viene plano desde BD
  const hasDelay =
    (activation as any).delayDays ||
    (activation as any).delayHours ||
    (activation as any).delayMinutes;

  return {
    ...activation,

    delayFrom: activation.delayFrom ?? "ON_TAG_APPLIED",

    delay: hasDelay
      ? {
        days: (activation as any).delayDays ?? 0,
        hours: (activation as any).delayHours ?? 0,
        minutes: (activation as any).delayMinutes ?? 0,
      }
      : undefined,

    tagOptions: Array.isArray((activation as any).tags)
      ? (activation as any).tags
        .map((t: any) => {
          const fullTag = tags.find(tag => tag.id === t.tagId);
          if (!fullTag) return null;

          return {
            id: String(fullTag.id),
            name: fullTag.name,
            color: fullTag.color,
          };
        })
        .filter(Boolean)
      : activation.tagOptions,

  };
}


export default function ActivationItem({
  activation,
  onChange,
  onDelete,
  disabled,
  tags
}: Props) {
  const normalizedOnceRef = useRef(false);

  useEffect(() => {
    // ⛔ ya normalizado
    if (normalizedOnceRef.current) return;

    // ⛔ tags aún no cargan
    if (!tags || tags.length === 0) return;

    // ⛔ no necesita normalización
    if (!needsNormalization(activation)) return;

    const normalized = normalizeActivationIfNeeded(activation, tags);

    onChange(normalized);
    normalizedOnceRef.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {/* ================= HEADER ================= */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={600}>
          {labelByType(activation.type)}
        </Typography>

        <IconButton
          size="small"
          onClick={onDelete}
          disabled={disabled}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ================= KEYWORD ================= */}
      {activation.type === "keyword" && (
        <TextField
          sx={{ mt: 2 }}
          size="small"
          fullWidth
          placeholder="Escriba una palabra clave"
          value={activation.keyword ?? ""}
          onChange={e =>
            onChange({ ...activation, keyword: e.target.value })
          }
          disabled={disabled}
        />
      )}

      {/* ================= FOLLOW UP ================= */}
      {activation.type === "tag_applied" && (
        <Stack spacing={2} mt={2}>
          <Typography variant="body2" color="text.secondary">
            Activación del seguimiento
          </Typography>

          {/* ===== ENTER / EXIT / DELAY ===== */}
          <RadioGroup
            value={activation.delayFrom ?? "ON_TAG_APPLIED"}
            onChange={e =>
              onChange({
                ...activation,
                delayFrom: e.target.value as any,
              })
            }
          >
            <FormControlLabel
              value="ON_TAG_APPLIED"
              control={<Radio />}
              label="Activar inmediatamente al entrar (cuando se aplique la etiqueta)"
              disabled={disabled}
            />

            <FormControlLabel
              value="ON_TAG_REMOVED"
              control={<Radio />}
              label="Activar inmediatamente al salir (cuando se quite la etiqueta)"
              disabled={disabled}
            />



          </RadioGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!activation.delay}
                onChange={e =>
                  onChange({
                    ...activation,
                    delay: e.target.checked
                      ? activation.delay ?? { days: 0, hours: 0, minutes: 0 }
                      : undefined,
                  })
                }
                disabled={disabled}
              />
            }
            label="Aplicar tiempo de espera antes de enviar el mensaje"
          />
          {/* ===== TAGS ===== */}
          <Typography variant="body2" color="text.secondary">
            Etiquetas
          </Typography>

          <TagMultiSelect
            options={tags.map(t => ({
              id: String(t.id), // 👈 FIX
              name: t.name,
              color: t.color,
            }))}
            value={activation.tagOptions ?? []}
            onChange={tagOptions =>
              onChange({ ...activation, tagOptions })
            }
            disabled={disabled}
          />



          {/* ===== DELAY (SOLO SI APLICA) ===== */}
          {!!activation.delay && (
            <>
              <Typography variant="body2" color="text.secondary">
                Tiempo de espera antes de enviar el mensaje
              </Typography>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Días"
                  type="number"
                  size="small"
                  value={activation.delay?.days ?? 0}
                  onChange={e =>
                    onChange({
                      ...activation,
                      delay: {
                        days: Number(e.target.value),
                        hours: activation.delay?.hours ?? 0,
                        minutes: activation.delay?.minutes ?? 0,
                      },
                    })
                  }
                  disabled={disabled}
                />

                <TextField
                  label="Horas"
                  type="number"
                  size="small"
                  value={activation.delay?.hours ?? 0}
                  onChange={e =>
                    onChange({
                      ...activation,
                      delay: {
                        days: activation.delay?.days ?? 0,
                        hours: Number(e.target.value),
                        minutes: activation.delay?.minutes ?? 0,
                      },
                    })
                  }
                  disabled={disabled}
                />

                <TextField
                  label="Minutos"
                  type="number"
                  size="small"
                  value={activation.delay?.minutes ?? 0}
                  onChange={e =>
                    onChange({
                      ...activation,
                      delay: {
                        days: activation.delay?.days ?? 0,
                        hours: activation.delay?.hours ?? 0,
                        minutes: Number(e.target.value),
                      },
                    })
                  }
                  disabled={disabled}
                />
              </Stack>

              {/* ===== HELPER TEXT ===== */}
              <Typography variant="caption" color="text.secondary">
                {buildHelperText(activation)}
              </Typography>
            </>
          )}
        </Stack>
      )}
    </Paper>
  );
}

/* ================= LABELS ================= */
function labelByType(type: Activation["type"]) {
  switch (type) {
    case "message_received":
      return "Por mensaje recibido";
    case "keyword":
      return "Por palabra clave en el mensaje";
    case "first_message":
      return "Primer mensaje del cliente";
    case "first_message_day":
      return "Primer mensaje del cliente del día";
    case "tag_applied":
      return "Cuando se aplique una etiqueta";
    default:
      return "";
  }
}

/* ================= HELPER TEXT ================= */
function buildHelperText(a: Activation) {
  const d = a.delay;
  if (!d) return "";

  const total =
    d.days > 0
      ? `${d.days} día(s)`
      : d.hours > 0
        ? `${d.hours} hora(s)`
        : `${d.minutes} minuto(s)`;

  switch (a.delayFrom) {
    case "ON_TAG_APPLIED":
      return `La unidad se activará ${total} después de que se aplique la etiqueta`;
    case "ON_TAG_REMOVED":
      return `La unidad se activará ${total} después de que se quite la etiqueta`;
    default:
      return `La unidad se activará ${total} después del tiempo definido`;
  }
}
