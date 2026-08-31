export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm font-medium text-slate-400">Cargando Finanzapp...</span>
      </div>
    </div>
  );
}
