import type { ModelType } from './types.ts';

export interface RouteDecision {
  model: ModelType;
  reason: string;
  isImageIntent: boolean;
  isSearchIntent: boolean;
}

export function routeMessageIntent(
  content: string,
  userSelectedModel: ModelType,
  hasAttachments: boolean = false
): RouteDecision {
  const lower = content.toLowerCase().trim();

  // Explicit image creation intent
  const imageKeywords = ['create an image', 'draw', 'generate image', 'generate a picture', 'paint', 'sketch of', 'illustration of'];
  const isImageIntent = imageKeywords.some(kw => lower.includes(kw));

  // Search intent keywords
  const searchKeywords = ['latest news', 'current price', 'weather today', 'who won', 'recent developments', 'search the web'];
  const isSearchIntent = searchKeywords.some(kw => lower.includes(kw));

  // If user explicitly picked a model, respect it unless an image mode is triggered
  if (userSelectedModel.includes('think') || userSelectedModel.includes('pro') || userSelectedModel.includes('coding')) {
    return {
      model: userSelectedModel,
      reason: `User selected ${userSelectedModel}`,
      isImageIntent,
      isSearchIntent,
    };
  }

  // Automatic routing rules (PRD Section 27)
  const codePatterns = [/```[\s\S]*```/, /\bdef\b/, /\bfunction\b/, /\bclass\b/, /dockerfile/i, /sql query/i, /refactor/i, /debug my/i];
  const isCoding = codePatterns.some(pat => pat.test(content));

  if (isCoding) {
    return {
      model: 'mindly-2.2-coding',
      reason: 'Coding logic/code syntax detected',
      isImageIntent,
      isSearchIntent,
    };
  }

  const mathOrReasoningPatterns = [/prove that/i, /step-by-step/i, /solve for/i, /derivation/i, /logic puzzle/i];
  const isDeepReasoning = mathOrReasoningPatterns.some(pat => pat.test(content));

  if (isDeepReasoning) {
    return {
      model: 'mindly-2.2-think',
      reason: 'Complex step-by-step reasoning detected',
      isImageIntent,
      isSearchIntent,
    };
  }

  if (hasAttachments || content.length > 500) {
    return {
      model: 'mindly-2.2-pro',
      reason: 'Long analysis/file context detected',
      isImageIntent,
      isSearchIntent,
    };
  }

  return {
    model: 'mindly-2.2-fast',
    reason: 'Standard conversational query',
    isImageIntent,
    isSearchIntent,
  };
}

export function cleanChatTitle(firstMessage: string): string {
  if (!firstMessage) return 'New Chat';
  // Strip common prefix filler
  let clean = firstMessage
    .replace(/^(can you|please|help me|explain|write a|generate a|how to|what is|tell me about)\s+/i, '')
    .trim();

  // Split into words, take max 5 words
  const words = clean.split(/\s+/).filter(Boolean).slice(0, 5);
  if (words.length === 0) return 'New Chat';
  const title = words.join(' ');
  // Capitalize first letter
  return title.charAt(0).toUpperCase() + title.slice(1, 35);
}

export function checkSafety(prompt: string): { safe: boolean; reason?: string } {
  const blockedPatterns = [
    /\b(make a bomb|build explosives|create malware|ransomware instructions|dox someone)\b/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(prompt)) {
      return {
        safe: false,
        reason: 'This request violates safety policies regarding dangerous or harmful content.',
      };
    }
  }

  return { safe: true };
}

export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  // Approximately 4 characters per token
  return Math.ceil(text.length / 4);
}

export interface TokenCostEstimate {
  tokenCount: number;
  costUsd: string;
  costInr: string;
  usdRaw: number;
  inrRaw: number;
  rateUsdPerM: number;
  rateInrPerM: number;
  modelName: string;
}

export const USD_TO_INR_RATE = 83.5;

// Pricing rates per 1,000,000 input tokens in USD
export const MODEL_PRICING_PER_MILLION: Record<ModelType, number> = {
  'mindly-2.2-fast': 0.075,
  'mindly-fast': 0.075,
  'mindly-2.2-pro': 1.25,
  'mindly-pro': 1.25,
  'mindly-2.2-think': 2.50,
  'mindly-think': 2.50,
  'mindly-2.2-coding': 1.50,
  'mindly-coding': 1.50,
};

export function calculateTokenCost(
  text: string,
  model: ModelType = 'mindly-2.2-fast',
  attachmentCount: number = 0
): TokenCostEstimate {
  const textTokens = estimateTokenCount(text);
  // An attached image or document adds approximately 258 baseline tokens
  const attachmentTokens = Math.max(0, attachmentCount) * 258;
  const tokenCount = textTokens + attachmentTokens;

  const rateUsdPerM = MODEL_PRICING_PER_MILLION[model] ?? 0.075;
  const rateInrPerM = Number((rateUsdPerM * USD_TO_INR_RATE).toFixed(2));

  const usdRaw = (tokenCount / 1_000_000) * rateUsdPerM;
  const inrRaw = usdRaw * USD_TO_INR_RATE;

  let costUsd: string;
  let costInr: string;

  if (tokenCount === 0) {
    costUsd = '$0.00';
    costInr = '₹0.00';
  } else if (usdRaw < 0.00001) {
    costUsd = `$${usdRaw.toFixed(6)}`;
    costInr = `₹${inrRaw.toFixed(5)}`;
  } else if (usdRaw < 0.01) {
    costUsd = `$${usdRaw.toFixed(5)}`;
    costInr = `₹${inrRaw.toFixed(4)}`;
  } else {
    costUsd = `$${usdRaw.toFixed(4)}`;
    costInr = `₹${inrRaw.toFixed(2)}`;
  }

  const modelLabels: Record<ModelType, string> = {
    'mindly-2.2-fast': 'MINDLY 2.2 Fast',
    'mindly-fast': 'MINDLY 2.2 Fast',
    'mindly-2.2-pro': 'MINDLY 2.2 Pro',
    'mindly-pro': 'MINDLY 2.2 Pro',
    'mindly-2.2-think': 'MINDLY 2.2 Think',
    'mindly-think': 'MINDLY 2.2 Think',
    'mindly-2.2-coding': 'MINDLY 2.2 Coding',
    'mindly-coding': 'MINDLY 2.2 Coding',
  };

  return {
    tokenCount,
    costUsd,
    costInr,
    usdRaw,
    inrRaw,
    rateUsdPerM,
    rateInrPerM,
    modelName: modelLabels[model] || 'MINDLY 2.2 Fast',
  };
}
