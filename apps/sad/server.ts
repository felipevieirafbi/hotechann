/**
 * Express backend for the Firebase-only SAD app.
 * Handles Gemini API calls server-side (API key must not be exposed to browser).
 * Runs on port 3001; Vite dev server (port 3000) proxies /api → here.
 */

import express from 'express';
import { GoogleGenAI, FunctionCallingConfigMode, Type } from '@google/genai';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

// ── Firebase init ─────────────────────────────────────────────────────────────
const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// ── Helpers ───────────────────────────────────────────────────────────────────
async function fetchDocs(collectionId: string) {
  const snap = await getDocs(collection(db, collectionId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── Gemini setup ──────────────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';

const SYSTEM_PROMPT = `Você é um Engenheiro Químico Especialista e Analista de MRP na Hotechann Faz.
Sua missão é atuar como "Safety Net" no processo de Planejamento de Produção.

[CONTEXTO]
O sistema detectou déficit em uma matéria-prima.
Você recebe a lista de substitutos homologados (pré-aprovados pelo químico).

[LÓGICA OPERACIONAL]
1. Analise o 'shortfall' (déficit de matéria prima).
2. Escolha o substituto com melhor equilíbrio entre disponibilidade, aiPreferenceScore e conversionFactor.
3. Acione a função "suggest_mrp_substitution" justificando em português a escolha,
   considerando FISPQs compatíveis e integridade da receita.
4. Se NENHUM substituto viável existir, preencha o melhor candidato e explique a limitação.`;

const SUBSTITUTION_FUNCTION = {
  name: 'suggest_mrp_substitution',
  description: 'Sugerir substituição de matéria-prima quando o estoque está abaixo do mínimo exigido.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      shortfallProductSku: {
        type: Type.STRING,
        description: 'SKU da matéria-prima original faltante',
      },
      substituteProductSku: {
        type: Type.STRING,
        description: 'SKU do material homologado sugerido como substituto',
      },
      conversionFactorApplied: {
        type: Type.NUMBER,
        description: 'Fator multiplicador para equalizar o rendimento químico (Ex: 1.15)',
      },
      chemicalReasoning: {
        type: Type.STRING,
        description: 'Justificativa físico-química ou de estoque para a substituição.',
      },
    },
    required: [
      'shortfallProductSku',
      'substituteProductSku',
      'conversionFactorApplied',
      'chemicalReasoning',
    ],
  },
};

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

app.post('/api/mrp/calculate', async (req, res) => {
  const { productSlug, quantity } = req.body as {
    productSlug: string;
    quantity: number;
  };

  try {
    const [rawMaterials, stockBalances, bomFormulas] = await Promise.all([
      fetchDocs('raw_materials'),
      fetchDocs('stock_balance'),
      fetchDocs('bom_formulas'),
    ]);

    const bom = (bomFormulas as any[]).find(
      (f) => f.productSlug === productSlug && f.isActive,
    );
    if (!bom) {
      res.status(404).json({ error: `BOM não encontrada para ${productSlug}` });
      return;
    }

    const yieldFactor = quantity / (bom.baseYieldQty ?? 1);
    const stockMap = new Map<string, number>(
      (stockBalances as any[]).map((s) => [s.rawMaterialId, Number(s.quantity ?? 0)]),
    );

    const items: any[] = [];
    const shortfalls: any[] = [];

    for (const item of bom.items ?? []) {
      const required = Number(item.requiredQty) * yieldFactor;
      const available = stackMap(stockMap, item.rawMaterialId);
      const isShortfall = available < required;

      const rm = (rawMaterials as any[]).find((r) => r.id === item.rawMaterialId);

      items.push({
        rawMaterialId: item.rawMaterialId,
        sku: rm?.sku ?? item.rawMaterialId,
        name: rm?.name ?? item.rawMaterialId,
        unit: rm?.unit ?? 'kg',
        requiredQty: round(required),
        availableQty: round(available),
        status: isShortfall ? 'DEFICIT' : 'OK',
      });

      if (isShortfall) {
        const fallbackObj: any = {
          rawMaterialId: item.rawMaterialId,
          rawMaterialSku: rm?.sku ?? item.rawMaterialId,
          rawMaterialName: rm?.name ?? item.rawMaterialId,
          requiredQty: round(required),
          availableQty: round(available),
          shortfallQty: round(required - available),
          availableSubstitutes: item.substitutes ?? [],
          aiSuggestion: null,
        };

        // ── Gemini substitution call ──────────────────────────────────────────
        if (GEMINI_API_KEY && (item.substitutes ?? []).length > 0) {
          try {
            const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
            const userPayload = {
              shortfall: {
                sku: fallbackObj.rawMaterialSku,
                name: fallbackObj.rawMaterialName,
                requiredQty: fallbackObj.requiredQty,
                availableQty: fallbackObj.availableQty,
                shortfallQty: fallbackObj.shortfallQty,
              },
              substitutes: fallbackObj.availableSubstitutes,
            };

            const response = await genai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: [{ role: 'user', parts: [{ text: JSON.stringify(userPayload) }] }],
              config: {
                systemInstruction: SYSTEM_PROMPT,
                tools: [{ functionDeclarations: [SUBSTITUTION_FUNCTION] }],
                toolConfig: {
                  functionCallingConfig: {
                    mode: FunctionCallingConfigMode.ANY,
                    allowedFunctionNames: ['suggest_mrp_substitution'],
                  },
                },
              },
            });

            const fnCall = response.functionCalls?.[0];
            if (fnCall?.name === 'suggest_mrp_substitution') {
              fallbackObj.aiSuggestion = fnCall.args;
            }
          } catch (aiErr: unknown) {
            const msg = aiErr instanceof Error ? aiErr.message : String(aiErr);
            console.error('AI Substitution Check failed:', msg, aiErr);
            fallbackObj.aiSuggestion = {
              error: `Falha IA: ${msg}`,
            };
          }
        }

        shortfalls.push(fallbackObj);
      }
    }

    res.json({
      product: { slug: productSlug },
      plannedQty: quantity,
      items,
      shortfalls,
      feasible: shortfalls.length === 0,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('MRP calculate error:', msg, err);
    res.status(500).json({ error: msg });
  }
});

function stackMap(map: Map<string, number>, key: string): number {
  return map.get(key) ?? 0;
}

function round(n: number, decimals = 4) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[server] Express rodando em http://localhost:${PORT}`);
  console.log(`[server] GEMINI_API_KEY: ${GEMINI_API_KEY ? 'CARREGADA ✓' : 'AUSENTE — sugestão IA desativada'}`);
});
