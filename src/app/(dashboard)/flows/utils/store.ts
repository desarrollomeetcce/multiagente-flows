export interface AutoResponse {
  id: string;
  name: string;
  channel: "whatsapp" | "email";
  condition: "contains" | "equals" | "startsWith";
  keyword: string;
  message: string;
  active: boolean;
}

export const mockResponses: AutoResponse[] = [
  {
    id: "1",
    name: "Precio WhatsApp",
    channel: "whatsapp",
    condition: "contains",
    keyword: "precio",
    message: "Hola 👋 Nuestro precio es de $199",
    active: true,
  },
];
