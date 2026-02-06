

/* =======================
   TIPOS
======================= */

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

/* =======================
   SERVICE
======================= */

export const FilesService = {
  getAll: async (): Promise<FileItem[]> => {
    const res = await pulpoFetch<FilesResponse>(
      "/api/getLogFile",
      {
        method: "POST",
      }
    );

    return res.files;
  },
};
