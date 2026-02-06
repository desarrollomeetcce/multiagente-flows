"use client";

import { useEffect, useRef, useState } from "react";
import NewAutoResponsePage from "../new/NewAutoResponseClient";
import { getResponseById } from "../../application/responses.repository";

export default function EditAutoResponseClient({ id }: { id: string }) {
  const hasLoaded = useRef(false); // 🔐 CLAVE
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (hasLoaded.current) return; // ⛔️ evita duplicados
    hasLoaded.current = true;

    (async () => {
      const data = await getResponseById(id);
      setInitialData(data);
    })();
  }, [id]);

  if (!initialData) {
    return <div>Cargando configuración…</div>;
  }

  return (
    <NewAutoResponsePage
      mode="edit"
      initialData={initialData}
    />
  );
}
