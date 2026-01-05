"use client";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Stack,
    Typography,
    Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import { Action, ActionType } from "../utils/types";
import AddActionMenu from "./AddActionMenu";
import SortableActionItem from "./SortableActionItem";

interface Props {
    actions?: Action[];   // 👈 opcional
    setActions?: (v: Action[]) => void;
    disabled?: boolean;
}


export default function ActionSection({
    actions = [],          // 👈 fallback seguro
    setActions = () => { }, // 👈 no-op,
    disabled,
}: Props) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const addAction = (type: ActionType) => {
        setActions([
            ...actions,
            { id: crypto.randomUUID(), type },
        ]);
    };

    const updateAction = (id: string, data: Action) => {
        setActions(actions.map(a => (a.id === id ? data : a)));
    };

    const removeAction = (id: string) => {
        setActions(actions.filter(a => a.id !== id));
    };

    const handleDragEnd = (event: any) => {
        if (!actions?.length) return;

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = actions.findIndex(a => a.id === active.id);
        const newIndex = actions.findIndex(a => a.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        setActions(arrayMove(actions, oldIndex, newIndex));
    };


    return (
        <Accordion defaultExpanded disabled={disabled} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>
                    Acción
                </Typography>
                <Chip
                    size="small"
                    label={`# ${Array.isArray(actions) ? actions.length : 0}`}
                    sx={{ ml: 2 }}
                />
            </AccordionSummary>

            <AccordionDetails>
                <Stack spacing={2}>
                    {actions.length === 0 && (
                        <Typography color="text.secondary">
                            No se ha asignado ninguna acción
                        </Typography>
                    )}

                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={actions.map(a => a.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Stack spacing={2}>
                                {actions.map((a, i) => (
                                    <SortableActionItem
                                        key={a.id}
                                        action={a}
                                        index={i}
                                        disabled={disabled}
                                        onChange={data => updateAction(a.id, data)}
                                        onDelete={() => removeAction(a.id)}
                                    />
                                ))}
                            </Stack>
                        </SortableContext>
                    </DndContext>

                    <Button
                        variant="outlined"
                        onClick={e => setAnchorEl(e.currentTarget)}
                        disabled={disabled}
                    >
                        Añadir acción
                    </Button>
                </Stack>

                <AddActionMenu
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    onSelect={addAction}
                />
            </AccordionDetails>
        </Accordion>
    );
}
