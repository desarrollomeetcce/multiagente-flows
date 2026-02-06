"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";

import {
  Activation,
  ActivationType,
  ResponseType,
} from "../utils/types";

import AddActivationMenu from "./AddActivationMenu";
import ActivationItem from "./ActivationItem";
import { Tag } from "@/app/shared/services/tags.service";



interface Props {
  activations: Activation[];
  setActivations: (v: Activation[]) => void;
  responseType?: ResponseType; // 🔥 nuevo
  disabled?: boolean;
    tags: Tag[]
}

export default function ActivationSection({
  activations,
  setActivations,
  responseType = "AUTO_RESPONSE",
  disabled,
  tags
}: Props) {


  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);



  

  const allowedActivationTypes: ActivationType[] =
    responseType === "FOLLOW_UP"
      ? ["tag_applied"]
      : [
        "message_received",
        "keyword",
        "first_message",
        "first_message_day",
        "tag_applied",
      ];

  const addActivation = (type: ActivationType) => {
    if (!allowedActivationTypes.includes(type)) return;

    setActivations([
      ...activations,
      { id: crypto.randomUUID(), type },
    ]);
  };

  const updateActivation = (id: string, data: Activation) => {
    setActivations(activations.map(a => (a.id === id ? data : a)));
  };

  const removeActivation = (id: string) => {
    setActivations(activations.filter(a => a.id !== id));
  };

  const canAddMore =
    responseType !== "FOLLOW_UP" || activations.length === 0;

  return (
    <Accordion defaultExpanded disabled={disabled} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={600}>
          {responseType === "FOLLOW_UP"
            ? "Activación del seguimiento"
            : "Activación de autoatención"}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2}>
          {activations.map(a => (
            <ActivationItem
              key={a.id}
              activation={a}
              disabled={disabled}
              onChange={data => updateActivation(a.id, data)}
              onDelete={() => removeActivation(a.id)}
              tags={tags}
            />
          ))}

          {canAddMore && (
            <Button
              variant="outlined"
              onClick={e => setAnchorEl(e.currentTarget)}
              disabled={disabled}
            >
              Añadir activación
            </Button>
          )}
        </Stack>

        <AddActivationMenu
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onSelect={addActivation}
          allowedTypes={allowedActivationTypes} // 🔥 siguiente paso
        />
      </AccordionDetails>
    </Accordion>
  );
}
