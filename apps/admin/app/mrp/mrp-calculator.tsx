'use client';

import { useState } from 'react';

type Product = { id: string; sku: string; name: string };

type MrpItem = {
  sku: string;
  name: string;
  unit: string;
  requiredQty: number;
  availableQty: number;
  status: 'OK' | 'SHORTFALL';
};

type AiSuggestion = {
  shortfallProductSku: string;
  substituteProductSku: string;
  conversionFactorApplied: number;
  chemicalReasoning: string;
};

type Shortfall = {
  rawMaterialSku: string;
  rawMaterialName: string;
  requiredQty: number;
  availableQty: number;
  shortfallQty: number;
  availableSubstitutes: Array<{
    sku: string;
    name: string;
    conversionFactor: number;
    aiPreferenceScore: number;
    availableQty: number;
  }>;
  aiSuggestion: AiSuggestion | null;
};

type MrpResponse = {
  product: { sku: string; name: string };
  plannedQty: number;
  bomVersion: string;
  items: MrpItem[];
  shortfalls: Shortfall[];
  feasible: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function MrpCalculator({ products }: { products: Product[] }) {
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(100);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MrpResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/mrp/requirements?productId=${productId}&quantity=${quantity}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCalculate}
        className="flex flex-col md:flex-row gap-4 items-end bg-neutral-900 border border-neutral-800 p-5 rounded-xl"
      >
        <div className="flex-1 min-w-0">
          <label className="block text-xs text-neutral-500 mb-1 uppercase tracking-wider">
            Produto acabado
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sku} — {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-neutral-500 mb-1 uppercase tracking-wider">
            Quantidade
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-32 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !productId}
          className="bg-brand text-black px-5 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
        >
          {loading ? 'Calculando…' : 'Calcular'}
        </button>
      </form>

      {error && (
        <div className="border border-red-800 bg-red-950/40 text-red-300 text-sm p-4 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <section className="space-y-6">
          <div
            className={`p-4 rounded-md text-sm ${
              result.feasible
                ? 'border border-green-800 bg-green-950/30 text-green-300'
                : 'border border-yellow-800 bg-yellow-950/30 text-yellow-200'
            }`}
          >
            {result.feasible
              ? `✅ Produção viável: ${result.plannedQty} un. de ${result.product.name} (BOM v${result.bomVersion})`
              : `⚠️ ${result.shortfalls.length} matéria(s)-prima(s) em déficit — veja sugestões abaixo.`}
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">
              Necessidade bruta
            </h2>
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-900 text-neutral-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-3 py-2">SKU</th>
                    <th className="text-left px-3 py-2">Matéria-prima</th>
                    <th className="text-right px-3 py-2">Necessário</th>
                    <th className="text-right px-3 py-2">Disponível</th>
                    <th className="text-right px-3 py-2">Un.</th>
                    <th className="text-right px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item) => (
                    <tr key={item.sku} className="border-t border-neutral-900">
                      <td className="px-3 py-2 font-mono text-xs">{item.sku}</td>
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2 text-right">
                        {item.requiredQty.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {item.availableQty.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-500">
                        {item.unit}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {item.status === 'OK' ? (
                          <span className="text-green-400">OK</span>
                        ) : (
                          <span className="text-yellow-400">DÉFICIT</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {result.shortfalls.length > 0 && (
            <div>
              <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">
                Sugestões de substituição (IA)
              </h2>
              <div className="space-y-3">
                {result.shortfalls.map((s) => (
                  <ShortfallCard key={s.rawMaterialSku} shortfall={s} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ShortfallCard({ shortfall }: { shortfall: Shortfall }) {
  return (
    <div className="border border-yellow-900/50 bg-yellow-950/10 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-yellow-400">
            {shortfall.rawMaterialSku}
          </p>
          <p className="font-medium">{shortfall.rawMaterialName}</p>
          <p className="text-xs text-neutral-500 mt-1">
            Necessário {shortfall.requiredQty} · Disponível {shortfall.availableQty}
            {' · '}Déficit{' '}
            <span className="text-yellow-400">{shortfall.shortfallQty}</span>
          </p>
        </div>
      </div>

      {shortfall.aiSuggestion ? (
        <div className="border-t border-neutral-800 pt-3">
          <p className="text-xs uppercase tracking-wider text-brand mb-2">
            Sugestão do Gemini (Function Calling)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-neutral-500">Substituir por</p>
              <p className="font-mono">
                {shortfall.aiSuggestion.substituteProductSku}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Fator de conversão</p>
              <p>{shortfall.aiSuggestion.conversionFactorApplied}×</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Justificativa</p>
              <p className="text-neutral-300 text-xs leading-relaxed">
                {shortfall.aiSuggestion.chemicalReasoning}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-neutral-500 italic">
          Nenhuma sugestão de IA disponível (sem substitutos homologados ou
          GEMINI_API_KEY ausente).
        </p>
      )}

      {shortfall.availableSubstitutes.length > 0 && (
        <div className="border-t border-neutral-800 pt-3">
          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
            Substitutos homologados ({shortfall.availableSubstitutes.length})
          </p>
          <ul className="text-xs space-y-1 text-neutral-400">
            {shortfall.availableSubstitutes.map((sub) => (
              <li key={sub.sku} className="flex justify-between">
                <span className="font-mono">
                  {sub.sku} — {sub.name}
                </span>
                <span>
                  fator {sub.conversionFactor}× · score{' '}
                  {sub.aiPreferenceScore} · estoque {sub.availableQty}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
