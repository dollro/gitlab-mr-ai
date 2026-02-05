import { Env } from "../../config/env";
import { AIProvider, AIProviderType } from "../../types/ai-provider.types";
import { GeminiProvider } from "./gemini.provider";
import { OpenAICompatibleProvider } from "./openai-compatible.provider";
import { OpenRouterProvider } from "./openrouter.provider";

// Singleton instances to avoid recreating clients
let geminiProvider: GeminiProvider | null = null;
let openAICompatibleProvider: OpenAICompatibleProvider | null = null;
let openRouterProvider: OpenRouterProvider | null = null;

/**
 * Factory function to get the appropriate AI provider based on configuration
 * @param providerType - Optional override for provider type, defaults to Env.AI_PROVIDER
 * @returns An instance of the requested AI provider
 */
export function getAIProvider(providerType?: AIProviderType): AIProvider {
  const provider = providerType || Env.AI_PROVIDER;

  switch (provider) {
    case "gemini":
      if (!geminiProvider) {
        geminiProvider = new GeminiProvider();
      }
      return geminiProvider;

    case "openai_compatible":
      if (!openAICompatibleProvider) {
        openAICompatibleProvider = new OpenAICompatibleProvider({
          baseURL: Env.OPENAI_COMPATIBLE_BASE_URL,
          apiKey: Env.OPENAI_COMPATIBLE_API_KEY,
          model: Env.OPENAI_COMPATIBLE_MODEL,
          headers: Env.OPENAI_COMPATIBLE_HEADERS
            ? JSON.parse(Env.OPENAI_COMPATIBLE_HEADERS)
            : undefined,
        });
      }
      return openAICompatibleProvider;

    case "openrouter":
      if (!openRouterProvider) {
        openRouterProvider = new OpenRouterProvider();
      }
      return openRouterProvider;

    default:
      throw new Error(
        `Unknown AI provider: ${provider}. Supported providers: gemini, openai_compatible, openrouter`
      );
  }
}

/**
 * Reset provider instances (useful for testing)
 */
export function resetProviders(): void {
  geminiProvider = null;
  openAICompatibleProvider = null;
  openRouterProvider = null;
}

// Re-export types and providers for direct access if needed
export { GeminiProvider } from "./gemini.provider";
export { OpenAICompatibleProvider } from "./openai-compatible.provider";
export { OpenRouterProvider } from "./openrouter.provider";
export type { AIProvider, AIProviderType, SummaryResult } from "../../types/ai-provider.types";
