import { MrpCalculator } from './mrp-calculator';

async function fetchProducts() {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const res = await fetch(`${base}/api/products?type=FINISHED_GOOD`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json() as Promise<Array<{ id: string; sku: string; name: string }>>;
}

export default async function MrpPage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-brand">
          Milestone 1 — Fatia Vertical
        </p>
        <h1 className="text-3xl font-semibold mt-2">
          Simulador MRP <span className="text-neutral-500">/ Necessidade Bruta</span>
        </h1>
        <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
          Selecione um produto acabado e a quantidade desejada. O motor calcula
          a necessidade de matéria-prima e, em caso de déficit, aciona o Gemini
          via Function Calling para sugerir substituição homologada.
        </p>
      </header>

      <MrpCalculator products={products} />
    </main>
  );
}
