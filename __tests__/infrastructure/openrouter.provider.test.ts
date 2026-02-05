import { OpenRouterProvider } from "../../src/infrastructure/providers/openrouter.provider";

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

// Mock env
jest.mock("../../src/config/env", () => ({
  Env: {
    OPENROUTER_API_KEY: "test-api-key",
    OPENROUTER_MODEL: "anthropic/claude-3.5-sonnet",
    OPENROUTER_SITE_URL: "",
    OPENROUTER_APP_NAME: "test-app",
  },
}));

describe("OpenRouterProvider", () => {
  let provider: OpenRouterProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new OpenRouterProvider();
  });

  it("should parse valid JSON response from OpenRouter", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "Test Title",
              description: "Real summary from OpenRouter",
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
    expect(result.description).toBe("Real summary from OpenRouter");
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
    expect(provider.name).toBe("openrouter");
    expect(typeof provider.generateSummary).toBe("function");
  });
});
