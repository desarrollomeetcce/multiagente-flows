"use client";

import {
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";

import { ActionType } from "../utils/types";

interface Props {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onSelect: (type: ActionType) => void;
}

export default function AddActionMenu({
    anchorEl,
    onClose,
    onSelect,
}: Props) {
    const open = Boolean(anchorEl);

    const select = (type: ActionType) => {
        onSelect(type);
        onClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
            {/* ===== ENVIAR MENSAJE ===== */}
            <MenuItem disabled sx={{ opacity: 0.7 }}>
                Enviar Mensaje
            </MenuItem>

            <MenuItem onClick={() => select("send_text")}>
                📝 Texto
            </MenuItem>

            <MenuItem onClick={() => select("send_image")}>
                🖼 Imagen
            </MenuItem>

            <MenuItem onClick={() => select("send_video")}>
                🎥 Video
            </MenuItem>

            <MenuItem onClick={() => select("send_audio")}>
                🎵 Audio
            </MenuItem>

            <MenuItem onClick={() => select("send_document")}>
                📄 Documentos
            </MenuItem>

            <MenuItem onClick={() => select("quick_replies")}>
                ⚡ Respuestas rápidas
            </MenuItem>

            <MenuItem onClick={() => select("pix")}>
                🔳 Pix
            </MenuItem>

            <MenuItem onClick={() => select("group_invite")}>
                👥 Invitación a grupo
            </MenuItem>

            <MenuItem onClick={() => select("contact")}>
                👤 Contacto
            </MenuItem>

            <MenuItem onClick={() => select("banner_link")}>
                🖼 Enlace con banner
            </MenuItem>

            <MenuItem onClick={() => select("sticker")}>
                😊 Pegatina
            </MenuItem>

            <Divider />

            {/* ===== OTRAS ===== */}
            <MenuItem onClick={() => select("delay")}>
                ⏱ Temporizador
            </MenuItem>

            <MenuItem onClick={() => select("add_tag")}>
                🏷 Agregar etiqueta
            </MenuItem>

            <MenuItem onClick={() => select("remove_tag")}>
                🗑 Remover etiqueta
            </MenuItem>
        </Menu>

    );
}
