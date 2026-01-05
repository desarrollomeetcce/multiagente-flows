import { MediaFile } from "@/app/shared/types/file";

export const mockFiles: MediaFile[] = [
  // ===== IMAGEN =====
  {
    id: "img-1",
    name: "promo.jpg",
    url: "https://picsum.photos/600/400",
    type: "image",
  },
  {
    id: "img-2",
    name: "banner.png",
    url: "https://picsum.photos/800/450",
    type: "image",
  },

  // ===== VIDEO =====
  {
    id: "vid-1",
    name: "video-demo.mp4",
    url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    type: "video",
  },

  // ===== AUDIO =====
  {
    id: "aud-1",
    name: "audio-demo.mp3",
    url: "https://sample-videos.com/audio/mp3/wave.mp3",
    type: "audio",
  },

  // ===== DOCUMENTO =====
  {
    id: "doc-1",
    name: "catalogo.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "document",
  },

  // ===== STICKER =====
  {
    id: "stk-1",
    name: "sticker.png",
    url: "https://picsum.photos/200",
    type: "sticker",
  },
];
