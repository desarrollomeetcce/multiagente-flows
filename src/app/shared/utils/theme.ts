import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#0f172a", // fondo app (tipo slate)
      paper: "#111827",   // fondo cards / paper
    },

    primary: {
      main: "#22c55e", // verde pro (success-like)
    },

    success: {
      main: "#22c55e",
    },

    divider: "rgba(255,255,255,0.08)",
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  },
});
