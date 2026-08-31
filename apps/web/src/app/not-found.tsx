'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-white">
      <h2 className="text-2xl font-bold mb-2">Página no encontrada (404)</h2>
      <p className="text-slate-400 text-sm mb-4">La página solicitada no está disponible.</p>
      <a href="/" className="px-4 py-2 bg-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-500">
        Volver al Panel Principal
      </a>
    </div>
  );
}
