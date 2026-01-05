import { Suspense } from "react";
import NewAutoResponseClient from "./NewAutoResponseClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando configuración...</div>}>
      <NewAutoResponseClient />
    </Suspense>
  );
}
