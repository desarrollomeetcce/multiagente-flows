"use server";

import { FilesService } from "@/app/shared/services/files.service";





export async function getFilesAction() {
  const files = await FilesService.getAll();
  return files;
}

export async function getbaseURL() {
  const baseUrl = process.env.PULPOCENTRAL_API_URL;

  if (!baseUrl) {
    throw new Error(
      "PULPOCENTRAL_API_URL no está definida. Revisa las variables de entorno."
    );
  }

 return baseUrl
}

