import { Suspense, use as usePromise } from "react";
import EditAutoResponseClient from "./EditAutoresponseClient";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);

  return (
    <Suspense fallback={<div>Cargando flujo...</div>}>
      <EditAutoResponseClient id={id} />
    </Suspense>
  );
}
