'use client'

import "./globals.css";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { darkTheme } from "./shared/utils/theme";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="es">
            <body>
                <ThemeProvider theme={darkTheme}>
                    {/* Normaliza estilos + aplica fondo */}
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </body>
        </html>
  );
}
