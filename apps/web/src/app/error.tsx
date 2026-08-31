'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-white">
      <h2 className="text-2xl font-bold mb-2">Algo salió mal</h2>
      <p className="text-slate-400 text-sm mb-4">Ocurrió un error inesperado al procesar la solicitud.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-500"
      >
        Reintentar
      </button>
    </div>
  );
}
