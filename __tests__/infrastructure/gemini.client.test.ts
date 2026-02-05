import { GeminiProvider } from "../../src/infrastructure/providers/gemini.provider";

jest.mock("fs/promises", () => ({
  readFile: jest.fn(() => Promise.resolve("PROMPT_TEMPLATE")),
}));

// Mock SDK structure from @google/genai
const mockGenerateContent = jest.fn();
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

// Mock env
jest.mock("../../src/config/env", () => ({
  Env: {
    GEMINI_API_KEY: "test-api-key",
    GEMINI_MODEL: "gemini-1.5-flash",
  },
}));

describe("GeminiProvider", () => {
  let provider: GeminiProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new GeminiProvider();
  });

  it("should parse valid JSON response from Gemini", async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        title: "Test Title",
        description: "Real summary",
        keyChanges: ["- file1.ts: updated function"],
      }),
    });

    const result = await provider.generateSummary("dummy-prompt.txt", [
      { new_path: "file1.ts", diff: "+ const a = 1;" },
    ]);

    expect(result.title).toBe("Test Title");
    expect(result.description).toBe("Real summary");
    expect(result.keyChanges).toContain("- file1.ts: updated function");
  });

  it("should strip markdown code blocks from JSON response", async () => {
    mockGenerateContent.mockResolvedValue({
      text: '```json\n{"title": "Stripped Title", "description": "Stripped description", "keyChanges": ["change1"]}\n```',
    });

    const result = await provider.generateSummary("dummy-prompt.txt", []);

    expect(result.title).toBe("Stripped Title");
    expect(result.description).toBe("Stripped description");
  });

  it("should throw error when no response text", async () => {
    mockGenerateContent.mockResolvedValue({ text: "" });

    await expect(
      provider.generateSummary("dummy-prompt.txt", [])
    ).rejects.toThrow("No response text from Gemini API.");
  });

  it("should implement AIProvider interface correctly", () => {
    expect(provider.name).toBe("gemini");
    expect(typeof provider.generateSummary).toBe("function");
  });
});
