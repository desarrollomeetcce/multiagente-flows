

/* =======================
   TIPOS
======================= */

import { pulpoFetch } from "../lib/pulpoFecth";

export interface Tag {
  id: number;
  userGroupId: number;
  name: string;
  color: string;
  tagIndex: number;
  tagGroupID: number;
  createdAt: string;
  updatedAt: string;
}

interface TagsResponse {
  status: "Success" | "Error";
  count: number;
  tags: Tag[];
}

/* =======================
   SERVICE
======================= */

export const TagsService = {
  getAll: async (): Promise<Tag[]> => {
    const res = await pulpoFetch<TagsResponse>("/api/v2/getUserTags", {
      method: "POST",
    });

    return res.tags;
  },
};
