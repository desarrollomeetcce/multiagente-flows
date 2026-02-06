"use server";

import { TagsService } from "@/app/shared/services/tags.service";



export async function getTagsAction() {
  const tags = await TagsService.getAll();
  return tags;
}
