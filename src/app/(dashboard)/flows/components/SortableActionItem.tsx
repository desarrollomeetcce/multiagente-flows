"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, IconButton } from "@mui/material";
import ActionItem from "./ActionItem";
import { Action } from "../utils/types";
import { Tag } from "@/app/shared/services/tags.service";
import { MediaFile } from "@/app/shared/types/file";


interface Props {
  action: Action;
  index: number;
  disabled?: boolean;
  onChange: (a: Action) => void;
  onDelete: () => void;
  tags: Tag[],
  files: MediaFile[]
}

export default function SortableActionItem(props: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.action.id,
    disabled: props.disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <Box display="flex" alignItems="flex-start" gap={1}>
        {/* Drag handle */}
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          disabled={props.disabled}
          sx={{ cursor: "grab", mt: 1 }}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>

        {/* Acción */}
        <Box flex={1}>
          <ActionItem {...props} tags={props.tags}/>
        </Box>
      </Box>
    </Box>
  );
}
