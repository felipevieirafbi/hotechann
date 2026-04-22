import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema, FunctionCallingConfigMode } from '@google/genai';
import path from 'path';
import fetch from 'node-fetch'; // Polyfill or native node fetch
import dotenv from 'dotenv';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };
dotenv.config();

const PORT = 3000;
const FIREBASE_PROJECT = 'gen-lang-client-0327594030';
const FIREBASE_DB = 'ai-studio-2a4565ca-1a02-4b4b-ac64-61db179ecb52';
const FIREBASE_API_KEY = firebaseConfig.apiKey;
// We'll use the native fetch connected to Firestore REST API

const app = express();
app.use(express.json());

// Set up Gemini SDK safely avoiding crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getAi() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined.");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const SUGGEST_SUBSTITUTION_DECLARATION = {
  name: 'suggest_mrp_substitution',
  description: 'Valida e justifica substituição de matéria-prima em déficit',
  parameters: {
    type: Type.OBJECT,
    properties: {
      shortfallProductSku: { type: Type.STRING },
      substituteProductSku: { type: Type.STRING },
      conversionFactorApplied: { type: Type.NUMBER },
      chemicalReasoning: { type: Type.STRING }
    },
    required: ['shortfallProductSku', 'substituteProductSku', 'conversionFactorApplied', 'chemicalReasoning']
  }
} as any;

// Helper to interact with the REST database since `firebase/firestore` is mostly for client
async function fetchDocs(collectionId: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/${FIREBASE_DB}/documents/${collectionId}?key=${FIREBASE_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${collectionId}`);
  const data: any = await response.json();
  if (!data.documents) return [];
  
  return data.documents.map((doc: any) => {
    // Basic extraction
    const fields = doc.fields || {};
    const parsed: any = { id: doc.name.split('/').pop() };
    for (const [key, val] of Object.entries(fields)) {
      const v = val as any;
      parsed[key] = v.stringValue !== undefined ? v.stringValue :
                    v.integerValue !== undefined ? parseInt(v.integerValue) :
                    v.doubleValue !== undefined ? parseFloat(v.doubleValue) :
                    v.booleanValue !== undefined ? v.booleanValue : null;
      if (v.arrayValue) {
        parsed[key] = v.arrayValue.values?.map((item: any) => {
           const obj: any = {};
           for (const [ik, iv] of Object.entries(item.mapValue.fields)) {
              obj[ik] = (iv as any).stringValue || (iv as any).integerValue || (iv as any).doubleValue || null;
           }
           return obj;
        });
      }
    }
    return parsed;
  });
}

const dbCache = {
   raw_materials: [] as any[],
   stock_balance: [] as any[],
   bom_formulas: [] as any[]
};

// API Route for calculating MRP
app.post('/api/mrp/calculate', async (req, res) => {
  try {
    const { productSlug, quantity } = req.body;
    if (!productSlug || !quantity) return res.status(400).json({ error: "Missing parameters" });

    // Ensure we have DB data
    const boms = await fetchDocs('bom_formulas');
    const bom = boms.find((b: any) => b.productSlug === productSlug && b.isActive);
    if (!bom) return res.status(404).json({ error: "BOM not found" });

    const rawMaterials = await fetchDocs('raw_materials');
    const stockBalance = await fetchDocs('stock_balance');

    const results: any[] = [];
    const shortfalls: any[] = [];
    let feasible = true;

    for (const item of bom.items) {
      const required = item.requiredQty * (quantity / bom.baseYieldQty);
      const stockDoc = stockBalance.find((s: any) => s.id === item.materialId || s.materialId === item.materialId);
      const available = stockDoc ? Number(stockDoc.qty) : 0;
      
      const mat = rawMaterials.find((m: any) => m.id === item.materialId);
      
      const resItem = {
        materialId: item.materialId,
        name: mat ? mat.name : item.materialId,
        unit: mat ? mat.unit : 'Un',
        required,
        available,
        status: (available >= required) ? 'OK' : 'SHORTFALL'
      };

      if (available < required) {
        feasible = false;
        const deficit = required - available;
        const fallbackObj: any = { ...resItem, deficit };
        
        if (item.substituteId) {
          const subMat = rawMaterials.find((m: any) => m.id === item.substituteId);
          const subStock = stockBalance.find((s: any) => s.id === item.substituteId || s.materialId === item.substituteId);
          
          fallbackObj.substituteId = item.substituteId;
          fallbackObj.substituteName = subMat ? subMat.name : item.substituteId;
          fallbackObj.substituteQty = subStock ? Number(subStock.qty) : 0;
          fallbackObj.conversionFactor = item.conversionFactor;

          try {
             // Gemini Substitution Call
             const ai = getAi();
             const prompt = `Você é engenheiro químico especialista em produtos de limpeza. Para produzir ${quantity}L de "${bom.productName}", falta ${deficit}${resItem.unit} de "${resItem.name}". Substituto disponível: "${fallbackObj.substituteName}" (${fallbackObj.substituteQty}${resItem.unit} em estoque), fator de conversão ${item.conversionFactor}x. Use a função suggest_mrp_substitution para validar e justifyicar essa substituição em português.`;
             
             const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                  tools: [{ functionDeclarations: [SUGGEST_SUBSTITUTION_DECLARATION] }],
                  toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.ANY } }
                }
             });

             const call = result.functionCalls?.[0];
             if (call) {
               fallbackObj.aiSuggestion = call.args;
             }
          } catch (aiErr) {
             console.error("AI Substitution Check failed", aiErr);
             fallbackObj.aiSuggestion = { error: "Não foi possível validar com a IA (Chave talvez não configurada)." };
          }
        }
        shortfalls.push(fallbackObj);
      }
      results.push(resItem);
    }
    
    res.json({ items: results, shortfalls, feasible });

  } catch (err: any) {
    console.error("MRP Error", err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server with Vite Integration
async function startServer() {
  const customPort = process.env.PORT ? Number(process.env.PORT) + 1 : 3001;

  if (process.env.NODE_ENV === 'production') {
    // production static
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server API + UI running on http://0.0.0.0:${PORT}`);
    });
  } else {
    // Development mode listens on 3001
    app.listen(customPort, '0.0.0.0', () => {
      console.log(`Development API Server running on http://0.0.0.0:${customPort}`);
    });
  }
}

startServer();
