import { OpenAICompatibleProvider } from "../../src/infrastructure/providers/openai-compatible.provider";

jest.mock("fs/promises", () => ({
  readFile: jest.fn(() => Promise.resolve("PROMPT_TEMPLATE")),
}));

// Mock OpenAI client
const mockCreate = jest.fn();
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

describe("OpenAICompatibleProvider", () => {
  let provider: OpenAICompatibleProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new OpenAICompatibleProvider({
      baseURL: "https://api.example.com/v1",
      apiKey: "test-api-key",
      model: "test-model",
    });
  });

  it("should throw error when API key is missing", () => {
    expect(
      () =>
        new OpenAICompatibleProvider({
          baseURL: "https://api.example.com/v1",
          apiKey: "",
          model: "test-model",
        })
    ).toThrow("API key is required for OpenAI-compatible provider");
  });

  it("should throw error when base URL is missing", () => {
    expect(
      () =>
        new OpenAICompatibleProvider({
          baseURL: "",
          apiKey: "test-key",
          model: "test-model",
        })
    ).toThrow("Base URL is required for OpenAI-compatible provider");
  });

  it("should parse valid JSON response", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "Test Title",
              description: "Test description",
              keyChanges: ["- file1.ts: updated function"],
            }),
          },
        },
      ],
    });

    const result = await provider.generateSummary("dummy-prompt.txt", [
      { new_path: "file1.ts", diff: "+ const a = 1;" },
    ]);

    expect(result.title).toBe("Test Title");
    expect(result.description).toBe("Test description");
    expect(result.keyChanges).toContain("- file1.ts: updated function");
  });

  it("should strip markdown code blocks from JSON response", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              '```json\n{"title": "Stripped Title", "description": "Stripped description", "keyChanges": ["change1"]}\n```',
          },
        },
      ],
    });

    const result = await provider.generateSummary("dummy-prompt.txt", []);

    expect(result.title).toBe("Stripped Title");
    expect(result.description).toBe("Stripped description");
  });

  it("should throw error when no response content", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "" } }],
    });

    await expect(
      provider.generateSummary("dummy-prompt.txt", [])
    ).rejects.toThrow("No response text from OpenAI-compatible API.");
  });

  it("should implement AIProvider interface correctly", () => {
    expect(provider.name).toBe("openai_compatible");
    expect(typeof provider.generateSummary).toBe("function");
  });

  it("should accept custom headers", () => {
    const providerWithHeaders = new OpenAICompatibleProvider({
      baseURL: "https://api.example.com/v1",
      apiKey: "test-api-key",
      model: "test-model",
      headers: { "X-Custom-Header": "custom-value" },
    });

    expect(providerWithHeaders.name).toBe("openai_compatible");
  });
});
