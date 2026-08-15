import { createGateway } from '@ai-sdk/gateway';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

const DEFAULT_GATEWAY_MODEL = 'openai/gpt-4o-mini';
const DEFAULT_OPENAI_COMPATIBLE_MODEL = 'gpt-4o-mini';

interface AiModelFactoryOptions {
  apiKey?: string;
  baseURL?: string;
}

function clean(value?: string) {
  const trimmed = value?.trim();

  return trimmed || undefined;
}

function toGatewayModelId(modelId?: string) {
  const resolved = clean(modelId) ?? DEFAULT_GATEWAY_MODEL;

  return resolved.includes('/') ? resolved : `openai/${resolved}`;
}

function toOpenAICompatibleModelId(modelId?: string) {
  const resolved = clean(modelId) ?? DEFAULT_OPENAI_COMPATIBLE_MODEL;

  if (!resolved.includes('/')) {
    return resolved;
  }

  const [, modelName] = resolved.split('/');

  return modelName || DEFAULT_OPENAI_COMPATIBLE_MODEL;
}

export function createAiModelFactory({
  apiKey: requestApiKey,
  baseURL: requestBaseURL,
}: AiModelFactoryOptions) {
  const apiKey = clean(requestApiKey) ?? clean(process.env.AI_GATEWAY_API_KEY);
  const baseURL = clean(requestBaseURL) ?? clean(process.env.AI_BASE_URL);

  if (!apiKey) {
    return null;
  }

  if (baseURL) {
    const provider = createOpenAI({
      apiKey,
      baseURL,
      name: 'openai-compatible',
    });

    return {
      isOpenAICompatible: true,
      model(modelId?: string): LanguageModel {
        return provider(toOpenAICompatibleModelId(modelId)) as LanguageModel;
      },
      primaryModelId(modelId?: string) {
        return toOpenAICompatibleModelId(modelId);
      },
    };
  }

  const provider = createGateway({ apiKey });

  return {
    isOpenAICompatible: false,
    model(modelId?: string): LanguageModel {
      return provider(toGatewayModelId(modelId)) as LanguageModel;
    },
    primaryModelId(modelId?: string) {
      return toGatewayModelId(modelId);
    },
  };
}
