export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-3">
        Hotechann <span className="text-brand">FAZ</span>
      </h1>
      <p className="text-neutral-400 text-sm uppercase tracking-widest">
        Painel Admin — ERP/MRP/CRM
      </p>
      <p className="mt-8 text-neutral-500 text-xs font-mono">
        MVP 0 — skeleton. Módulos serão conectados aos endpoints da API
        ({process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}).
      </p>
    </main>
  );
}
