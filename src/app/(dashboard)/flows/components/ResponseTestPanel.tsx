"use client";


import { useState } from "react";
import { AutoResponse } from "../utils/store";

interface Props {
  response: AutoResponse;
}

export default function ResponseTestPanel({ response }: Props) {
  const [input, setInput] = useState("");
  const matches =
    response.condition === "contains"
      ? input.includes(response.keyword)
      : response.condition === "equals"
      ? input === response.keyword
      : input.startsWith(response.keyword);

  return (
    <div className="border rounded p-4 space-y-3">
      <h3 className="font-semibold">🧪 Probar autorespuesta</h3>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Mensaje de prueba"
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <div className="text-sm">
        {matches ? (
          <div className="bg-green-50 p-3 rounded">
            <b>Respuesta:</b>
            <div className="mt-1">{response.message}</div>
          </div>
        ) : (
          <div className="text-gray-500">
            ❌ Esta regla no se activaría con este mensaje
          </div>
        )}
      </div>
    </div>
  );
}
