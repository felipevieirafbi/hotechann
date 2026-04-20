import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-3">
        Hotechann <span className="text-brand">FAZ</span>
      </h1>
      <p className="text-neutral-400 text-sm uppercase tracking-widest">
        Painel Admin — ERP/MRP/CRM
      </p>

      <nav className="mt-10 flex gap-3">
        <Link
          href="/mrp"
          className="px-4 py-2 rounded-md bg-brand text-black text-sm font-semibold"
        >
          Simulador MRP →
        </Link>
      </nav>

      <p className="mt-12 text-neutral-500 text-xs font-mono">
        Milestone 1 — Fatia Vertical (Produto + BOM + MRP com IA)
      </p>
    </main>
  );
}
