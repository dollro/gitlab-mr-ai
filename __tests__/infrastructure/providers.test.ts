import {
  getAIProvider,
  resetProviders,
} from "../../src/infrastructure/providers";
import { GeminiProvider } from "../../src/infrastructure/providers/gemini.provider";
import { OpenAICompatibleProvider } from "../../src/infrastructure/providers/openai-compatible.provider";
import { OpenRouterProvider } from "../../src/infrastructure/providers/openrouter.provider";

// Mock environment
jest.mock("../../src/config/env", () => ({
  Env: {
    AI_PROVIDER: "gemini",
    GEMINI_API_KEY: "test-gemini-key",
    GEMINI_MODEL: "gemini-1.5-flash",
    OPENAI_COMPATIBLE_BASE_URL: "https://api.example.com/v1",
    OPENAI_COMPATIBLE_API_KEY: "test-openai-compatible-key",
    OPENAI_COMPATIBLE_MODEL: "test-model",
    OPENAI_COMPATIBLE_HEADERS: "",
    OPENROUTER_API_KEY: "test-openrouter-key",
    OPENROUTER_MODEL: "anthropic/claude-3.5-sonnet",
    OPENROUTER_SITE_URL: "",
    OPENROUTER_APP_NAME: "test-app",
  },
}));

// Mock the AI SDKs
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: { generateContent: jest.fn() },
  })),
}));

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: { completions: { create: jest.fn() } },
  }));
});

describe("AI Provider Factory", () => {
  beforeEach(() => {
    resetProviders();
  });

  it("should return GeminiProvider when provider type is gemini", () => {
    const provider = getAIProvider("gemini");
    expect(provider).toBeInstanceOf(GeminiProvider);
    expect(provider.name).toBe("gemini");
  });

  it("should return OpenAICompatibleProvider when provider type is openai_compatible", () => {
    const provider = getAIProvider("openai_compatible");
    expect(provider).toBeInstanceOf(OpenAICompatibleProvider);
    expect(provider.name).toBe("openai_compatible");
  });

  it("should return OpenRouterProvider when provider type is openrouter", () => {
    const provider = getAIProvider("openrouter");
    expect(provider).toBeInstanceOf(OpenRouterProvider);
    expect(provider.name).toBe("openrouter");
  });

  it("should return singleton instance for same provider", () => {
    const provider1 = getAIProvider("gemini");
    const provider2 = getAIProvider("gemini");
    expect(provider1).toBe(provider2);
  });

  it("should return singleton instance for openai_compatible provider", () => {
    const provider1 = getAIProvider("openai_compatible");
    const provider2 = getAIProvider("openai_compatible");
    expect(provider1).toBe(provider2);
  });

  it("should throw error for unknown provider", () => {
    expect(() => getAIProvider("unknown" as any)).toThrow(
      "Unknown AI provider: unknown"
    );
  });

  it("should use Env.AI_PROVIDER as default when no type specified", () => {
    // Default is gemini based on our mock
    const provider = getAIProvider();
    expect(provider).toBeInstanceOf(GeminiProvider);
  });
});
