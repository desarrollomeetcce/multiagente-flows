"use client";

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import KeyIcon from "@mui/icons-material/VpnKey";
import TodayIcon from "@mui/icons-material/Today";
import PersonIcon from "@mui/icons-material/Person";
import LabelIcon from "@mui/icons-material/Label";

import { ActivationType } from "../utils/types";

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelect: (type: ActivationType) => void;
  allowedTypes?: ActivationType[];
}

export default function AddActivationMenu({
  anchorEl,
  onClose,
  onSelect,
  allowedTypes,
}: Props) {
  const open = Boolean(anchorEl);

  const handleSelect = (type: ActivationType) => {
    onSelect(type);
    onClose();
  };

  const ACTIVATION_OPTIONS: {
    type: ActivationType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: "message_received",
      label: "Por mensaje recibido",
      icon: <MessageIcon />,
    },
    {
      type: "keyword",
      label: "Por palabra clave en el mensaje",
      icon: <KeyIcon />,
    },
    {
      type: "first_message_day",
      label: "Primer mensaje del cliente del día",
      icon: <TodayIcon />,
    },
    {
      type: "first_message",
      label: "Primer mensaje del cliente",
      icon: <PersonIcon />,
    },
    {
      type: "tag_applied",
      label: "Cuando se aplique una etiqueta",
      icon: <LabelIcon />,
    },
  ];

  const options = allowedTypes
    ? ACTIVATION_OPTIONS.filter(o =>
        allowedTypes.includes(o.type)
      )
    : ACTIVATION_OPTIONS;

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {options.map(option => (
        <MenuItem
          key={option.type}
          onClick={() => handleSelect(option.type)}
        >
          <ListItemIcon>{option.icon}</ListItemIcon>
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </Menu>
  );
}
