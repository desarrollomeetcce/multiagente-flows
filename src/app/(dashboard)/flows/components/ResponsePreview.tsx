interface Props {
  message: string;
}

export default function ResponsePreview({ message }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-2">📱 Vista previa</h3>
      <div className="bg-white p-3 rounded shadow text-sm whitespace-pre-wrap">
        {message || "Aquí se mostrará la respuesta"}
      </div>
    </div>
  );
}
