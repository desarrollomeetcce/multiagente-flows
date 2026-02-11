
import { getbaseURL } from "@/app/(dashboard)/flows/application/file.action";
import { pulpoFetch } from "../lib/pulpoFecth";

export interface FileItem {
  id: number;
  name: string;
  path: string;
  fbAttachmentID: string | null;
  userGroupId: number;
  owner: number;
  createdAt: string;
  updatedAt: string;
  Users: any[];
}

interface FilesResponse {
  status: "Success" | "Error";
  files: FileItem[];
}



export const FilesService = {
  getAll: async (): Promise<FileItem[]> => {
    const res = await pulpoFetch<FilesResponse>("/api/getLogFile", {
      method: "POST",
    });
    return res.files;
  },

  uploadSingleFile: async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<FileItem | null> => {

    const formData = new FormData();
    formData.append("file", file);
    const BASE_URL = await getbaseURL();
    const uploadRes = await new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 👇 MISMA BASE QUE pulpoFetch
      xhr.open("PATCH", `${BASE_URL}/api/upload`, true);

      // 👇 MISMO TOKEN QUE pulpoFetch
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token2="))
        ?.split("=")[1];

      if (token) {
        xhr.setRequestHeader("pulpocentral-access-token", token);
      }

      xhr.upload.onprogress = (evt) => {
        if (!evt.total) return;
        const percent = Math.round((evt.loaded * 100) / evt.total);
        onProgress?.(percent);
      };

      xhr.onload = () => {
        try {
          resolve(JSON.parse(xhr.responseText || "{}"));
        } catch {
          reject(new Error("Respuesta inválida de /api/upload"));
        }
      };

      xhr.onerror = () =>
        reject(new Error("Error de red al subir archivo"));

      xhr.send(formData);
    });

    const filePath =
      uploadRes?.fielName ||
      uploadRes?.fileName ||
      uploadRes?.path;

    if (!filePath) return null;

    /* ===== registrar en BD ===== */
    const addRes = await pulpoFetch<any>("/api/addFiles", {
      method: "POST",
      body: JSON.stringify({ files: [filePath] }),
    });

    const first = addRes?.files?.[0];
    if (!first) return null;

    if (typeof first === "object" && first.id && first.path) {
      return first as FileItem;
    }

    const id = Number(first);
    if (!Number.isFinite(id)) return null;

    return {
      id,
      name: file.name,
      path: filePath,
      fbAttachmentID: null,
      userGroupId: 0 as any,
      owner: 0 as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      Users: [],
    };
  }

};
