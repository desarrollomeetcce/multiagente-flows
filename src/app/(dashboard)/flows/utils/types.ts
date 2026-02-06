import { TagOption } from "@/app/shared/components/TagMultiSelect";
import { MediaFile } from "@/app/shared/types/file";

/* =========================
 * RESPONSE TYPE
 * ========================= */
export type ResponseType = "AUTO_RESPONSE" | "FOLLOW_UP";

/* =========================
 * FOLLOW UP CONFIG
 * ========================= */
export type FollowUpDelayFrom =
  | "ON_TAG_APPLIED"
  | "ON_TAG_REMOVED"
  | "AFTER_DELAY";
/* =========================
 * ACTIVATIONS
 * ========================= */
export type ActivationType =
  | "message_received"
  | "keyword"
  | "first_message"
  | "first_message_day"
  | "tag_applied"; // FOLLOW UP

export interface Activation {
  id: string;
  type: ActivationType;

  keyword?: string;

  tagOptions?: TagOption[];
  delayFrom?: FollowUpDelayFrom;

  delay?: {
    days: number;
    hours: number;
    minutes: number;
  };
}

/* =========================
 * RULES
 * ========================= */
export interface Rules {
  noGroups: boolean;
  onlySchedule: boolean;
  ignoreIfOpen: boolean;
  ignoreIfArchived: boolean;
}

/* =========================
 * ACTIONS
 * ========================= */
export type MessageActionType =
  | "send_text"
  | "send_image"
  | "send_video"
  | "send_audio"
  | "send_document"
  | "quick_replies"
  | "pix"
  | "group_invite"
  | "contact"
  | "banner_link"
  | "sticker";

export type ActionType =
  | MessageActionType
  | "delay"
  | "add_tag"
  | "remove_tag";

export interface Action {
  id: string;
  type: ActionType;

  /* ---------- COMMON ---------- */
  delaySeconds?: number;

  /* ---------- TEXT ---------- */
  text?: string;

  /* ---------- MEDIA ---------- */
  file?: MediaFile | null;

  /* ---------- QUICK REPLIES ---------- */
  replies?: string[];

  /* ---------- CONTACT ---------- */
  contactName?: string;
  contactPhone?: string;

  /* ---------- TAG ACTIONS ---------- */
  tags?: TagOption[];
}


export interface ResponseDefinition {
  id: string;
  name: string;
  type: ResponseType;
  enabled: boolean;
   sessions: string[]; 
  activations: Activation[];
  actions: Action[];
  rules: Rules;

  createdAt?: string;
}

export type FollowUpStatus =
  | "PENDING"
  | "EXECUTED"
  | "CANCELLED";
