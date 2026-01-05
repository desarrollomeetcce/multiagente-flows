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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Activation } from "../utils/types";
import TagMultiSelect from "@/app/shared/components/TagMultiSelect";
import { mockTags } from "../utils/tags.mock";

interface Props {
  activation: Activation;
  onChange: (a: Activation) => void;
  onDelete: () => void;
  disabled?: boolean;
}

export default function ActivationItem({
  activation,
  onChange,
  onDelete,
  disabled,
}: Props) {
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
            value={activation.delayFrom ?? "AFTER_DELAY"}
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

            <FormControlLabel
              value="AFTER_DELAY"
              control={<Radio />}
              label="Activar después de un tiempo definido"
              disabled={disabled}
            />
          </RadioGroup>

          {/* ===== TAGS ===== */}
          <Typography variant="body2" color="text.secondary">
            Etiquetas
          </Typography>

          <TagMultiSelect
            options={mockTags}
            value={activation.tagOptions ?? []}
            onChange={tagOptions =>
              onChange({ ...activation, tagOptions })
            }
            disabled={disabled}
          />

          {/* ===== DELAY (SOLO SI APLICA) ===== */}
          {activation.delayFrom === "AFTER_DELAY" && (
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
