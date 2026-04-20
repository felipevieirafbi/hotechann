/**
 * Contrato do Function Calling "suggest_mrp_substitution" — acordado com o
 * dashboard SAD (apps/sad). É o JSON que o Gemini é FORÇADO a preencher
 * quando uma matéria-prima entra em déficit.
 */
export interface SuggestMrpSubstitutionPayload {
  shortfallProductSku: string;
  substituteProductSku: string;
  conversionFactorApplied: number;
  chemicalReasoning: string;
}

export interface MrpShortfallItem {
  rawMaterialId: string;
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
  aiSuggestion: SuggestMrpSubstitutionPayload | null;
}

export interface MrpRequirementsResponse {
  product: { id: string; sku: string; name: string };
  plannedQty: number;
  bomVersion: string;
  items: Array<{
    rawMaterialId: string;
    sku: string;
    name: string;
    unit: string;
    requiredQty: number;
    availableQty: number;
    status: 'OK' | 'SHORTFALL';
  }>;
  shortfalls: MrpShortfallItem[];
  feasible: boolean;
}
