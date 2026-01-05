"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Rules } from "../utils/types";
import RuleItem from "./RuleItem";

interface Props {
  rules: Rules;
  setRules: (v: Rules) => void;
  disabled?: boolean;
}

export default function RulesSection({
  rules,
  setRules,
  disabled,
}: Props) {
  return (
    <Accordion sx={{ mb: 3 }} disabled={disabled}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={600}>
          Reglas de Activación
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2}>
          <RuleItem
            label="No responder en grupos"
            description="La auto atención no se ejecutará en conversaciones grupales."
            checked={rules.noGroups}
            disabled={disabled}
            onChange={(v) =>
              setRules({ ...rules, noGroups: v })
            }
          />

          <RuleItem
            label="Solo responder en horario laboral"
            description="La auto atención solo se ejecutará dentro del horario configurado."
            checked={rules.onlySchedule}
            disabled={disabled}
            onChange={(v) =>
              setRules({ ...rules, onlySchedule: v })
            }
          />

          <RuleItem
            label="No responder si la conversación está abierta"
            description="Evita respuestas automáticas cuando un asesor ya atiende la conversación."
            checked={rules.ignoreIfOpen}
            disabled={disabled}
            onChange={(v) =>
              setRules({ ...rules, ignoreIfOpen: v })
            }
          />

          <RuleItem
            label="No responder si la conversación está archivada"
            description="La auto atención no se ejecutará en conversaciones archivadas."
            checked={rules.ignoreIfArchived}
            disabled={disabled}
            onChange={(v) =>
              setRules({ ...rules, ignoreIfArchived: v })
            }
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
