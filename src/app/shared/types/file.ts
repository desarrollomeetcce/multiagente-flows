export interface MediaFile {
  id: string;
  name: string;
  url: string;        // URL real o blob
  type: "image" | "video" | "audio" | "document" | "sticker";
  isTemp?: boolean;  // 👈 indica que viene de upload local
}
