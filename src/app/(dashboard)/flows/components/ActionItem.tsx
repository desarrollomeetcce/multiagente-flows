"use client";

import {
    Box,
    IconButton,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Action } from "../utils/types";
import TagMultiSelect from "@/app/shared/components/TagMultiSelect";
import FilePicker from "@/app/shared/components/FilePicker";
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
function mapType(type: string) {
    switch (type) {
        case "send_image":
            return "image";
        case "send_video":
            return "video";
        case "send_audio":
            return "audio";
        case "send_document":
            return "document";
        case "sticker":
            return "sticker";
        default:
            return "image";
    }
}

function acceptByType(type: string) {
    switch (type) {
        case "send_image":
            return "image/*";
        case "send_video":
            return "video/*";
        case "send_audio":
            return "audio/*";
        case "send_document":
            return ".pdf,.doc,.docx";
        default:
            return "*";
    }
}

export default function ActionItem({
    action,
    index,
    onChange,
    onDelete,
    disabled,
    tags,
    files
}: Props) {

    

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={600}>
                    {index + 1}. {labelByType(action.type)}
                </Typography>

                <IconButton
                    size="small"
                    onClick={onDelete}
                    disabled={disabled}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Configuración por tipo */}
            {action.type === "send_text" && (
                <TextField
                    sx={{ mt: 2 }}
                    multiline
                    minRows={3}
                    fullWidth
                    placeholder="Escriba el mensaje"
                    value={action.text ?? ""}
                    onChange={e =>
                        onChange({ ...action, text: e.target.value })
                    }
                    disabled={disabled}
                />
            )}
            {[
                "send_image",
                "send_video",
                "send_audio",
                "send_document",
                "sticker",
                "banner_link",
            ].includes(action.type) && (
                    <Box mt={2}>
                        <FilePicker
                            label="Archivo"
                            options={files.filter(f =>
                                f.type === mapType(action.type)
                            )}
                            value={action.file ?? null}
                            accept={acceptByType(action.type)}
                            disabled={disabled}
                            onSelect={(file) =>
                                onChange({ ...action, file })
                            }
                            onUpload={(file) =>
                                onChange({ ...action, file }) // 👈 AQUÍ
                            }
                        />

                    </Box>
                )}

            {action.type === "quick_replies" && (
                <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Una respuesta por línea"
                    value={(action.replies ?? []).join("\n")}
                    onChange={e =>
                        onChange({
                            ...action,
                            replies: e.target.value.split("\n"),
                        })
                    }
                    disabled={disabled}
                />
            )}
            {action.type === "contact" && (
                <>
                    <TextField
                        sx={{ mt: 2 }}
                        fullWidth
                        size="small"
                        placeholder="Nombre del contacto"
                        value={action.contactName ?? ""}
                        onChange={e =>
                            onChange({ ...action, contactName: e.target.value })
                        }
                        disabled={disabled}
                    />
                    <TextField
                        sx={{ mt: 2 }}
                        fullWidth
                        size="small"
                        placeholder="Teléfono"
                        value={action.contactPhone ?? ""}
                        onChange={e =>
                            onChange({ ...action, contactPhone: e.target.value })
                        }
                        disabled={disabled}
                    />
                </>
            )}



            {(action.type === "add_tag" || action.type === "remove_tag") && (
                <Box mt={2}>

                    <TagMultiSelect
                        label={
                            action.type === "add_tag"
                                ? "Etiquetas a agregar"
                                : "Etiquetas a remover"
                        }
                        options={tags.map(t => ({
                            id: String(t.id), // 👈 FIX
                            name: t.name,
                            color: t.color,
                        }))}
                        value={action.tags ?? []}
                        onChange={(tags) =>
                            onChange({ ...action, tags })
                        }
                        disabled={disabled}
                    />
                </Box>
            )}

            {/* Delay antes de la siguiente acción */}
            <TextField
                sx={{ mt: 2, width: 260 }}
                label="Esperar antes de la siguiente acción (seg)"
                type="number"
                size="small"
                value={action.delaySeconds ?? 0}
                onChange={e =>
                    onChange({
                        ...action,
                        delaySeconds: Number(e.target.value),
                    })
                }
                disabled={disabled}
            />
        </Paper>
    );
}

function labelByType(type: Action["type"]) {
    switch (type) {
        case "send_text":
            return "Crear mensaje de texto";
        case "delay":
            return "Tiempo de espera";
        case "add_tag":
            return "Agregar etiqueta";
        case "remove_tag":
            return "Remover etiqueta";
    }
}
