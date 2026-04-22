import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type } from '@google/genai';
import type {
  MrpShortfallItem,
  SuggestMrpSubstitutionPayload,
} from './dto/suggest-substitution.dto';

const SYSTEM_PROMPT = `Você é um Engenheiro Químico Especialista e Analista de MRP na Hotechann Faz.
Sua missão é atuar como "Safety Net" no processo de Planejamento de Produção.

[CONTEXTO]
O NestJS acabou de rodar o /mrp/requirements e detectou déficit em uma matéria-prima.
Você recebe a lista de substitutos homologados (pré-aprovados pelo químico).

[LÓGICA OPERACIONAL]
1. Analise o 'shortfall' (déficit de matéria prima).
2. Escolha o substituto com melhor equilíbrio entre:
   - disponibilidade (availableQty)
   - aiPreferenceScore mais alto (feedback humano prévio)
   - conversionFactor aceitável
3. Aplique o conversionFactor correto para manter o rendimento químico.
4. Acione a função "suggest_mrp_substitution" justificando em português
   a escolha, considerando FISPQs compatíveis e integridade da receita.
5. Se NENHUM substituto viável existir, ainda assim preencha o melhor candidato
   e explique a limitação em chemicalReasoning.`;

const FUNCTION_DECLARATION = {
  name: 'suggest_mrp_substitution',
  description:
    'Sugerir substituição de matéria-prima quando o estoque está abaixo do mínimo exigido.',
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
        description:
          'Fator multiplicador para equalizar o rendimento químico (Ex: 1.15)',
      },
      chemicalReasoning: {
        type: Type.STRING,
        description:
          'Justificativa físico-química ou de estoque para a substituição.',
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

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly client: GoogleGenAI | null;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
    if (!this.client) {
      this.logger.warn(
        'GEMINI_API_KEY ausente — sugestões de substituição ficarão indisponíveis.',
      );
    }
  }

  async suggestSubstitution(
    shortfall: MrpShortfallItem,
  ): Promise<SuggestMrpSubstitutionPayload | null> {
    if (!this.client) return null;
    if (shortfall.availableSubstitutes.length === 0) return null;

    const userPayload = {
      shortfall: {
        sku: shortfall.rawMaterialSku,
        name: shortfall.rawMaterialName,
        requiredQty: shortfall.requiredQty,
        availableQty: shortfall.availableQty,
        shortfallQty: shortfall.shortfallQty,
      },
      substitutes: shortfall.availableSubstitutes,
    };

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          { role: 'user', parts: [{ text: JSON.stringify(userPayload) }] },
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations: [FUNCTION_DECLARATION] }],
          toolConfig: {
            functionCallingConfig: {
              mode: 'ANY',
              allowedFunctionNames: ['suggest_mrp_substitution'],
            },
          },
        },
      });

      const fnCall = response.functionCalls?.[0];
      if (!fnCall || fnCall.name !== 'suggest_mrp_substitution') {
        this.logger.warn('Gemini não retornou function call válida.');
        return null;
      }

      return fnCall.args as unknown as SuggestMrpSubstitutionPayload;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Falha ao chamar Gemini: ${msg}`,
        err instanceof Error ? err.stack : undefined,
      );
      return null;
    }
  }
}
