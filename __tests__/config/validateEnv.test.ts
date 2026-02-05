import { validateEnv } from "../../src/config/validateEnv";

describe("validateEnv", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("with gemini provider (default)", () => {
    it("should exit if GEMINI_API_KEY is missing", () => {
      delete process.env.GEMINI_API_KEY;
      process.env.AI_PROVIDER = "gemini";
      process.env.GITLAB_TOKEN = "dummy";
      process.env.GITLAB_PROJECT_ID = "123";

      const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("exit called");
      });

      expect(() => validateEnv()).toThrow("exit called");

      spyExit.mockRestore();
    });

    it("should pass if all required env vars exist for gemini", () => {
      process.env.AI_PROVIDER = "gemini";
      process.env.GEMINI_API_KEY = "dummy";
      process.env.GITLAB_TOKEN = "dummy";
      process.env.GITLAB_PROJECT_ID = "123";

      expect(() => validateEnv()).not.toThrow();
    });
  });

  describe("with openai_compatible provider", () => {
    it("should exit if OPENAI_COMPATIBLE_BASE_URL is missing", () => {
      delete process.env.OPENAI_COMPATIBLE_BASE_URL;
      process.env.AI_PROVIDER = "openai_compatible";
      process.env.OPENAI_COMPATIBLE_API_KEY = "dummy";
      process.env.OPENAI_COMPATIBLE_MODEL = "test-model";
      process.env.GITLAB_TOKEN = "dummy";
      process.env.GITLAB_PROJECT_ID = "123";

      const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("exit called");
      });

      expect(() => validateEnv()).toThrow("exit called");

      spyExit.mockRestore();
    });

    it("should exit if OPENAI_COMPATIBLE_API_KEY is missing", () => {
      delete process.env.OPENAI_COMPATIBLE_API_KEY;
      process.env.AI_PROVIDER = "openai_compatible";
      process.env.OPENAI_COMPATIBLE_BASE_URL = "https://api.example.com/v1";
      process.env.OPENAI_COMPATIBLE_MODEL = "test-model";
      process.env.GITLAB_TOKEN = "dummy";
      process.env.GITLAB_PROJECT_ID = "123";

      const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("exit called");
      });

      expect(() => validateEnv()).toThrow("exit called");

      spyExit.mockRestore();
    });

    it("should exit if OPENAI_COMPATIBLE_MODEL is missing", () => {
      delete process.env.OPENAI_COMPATIBLE_MODEL;
      process.env.AI_PROVIDER = "openai_compatible";
      process.env.OPENAI_COMPATIBLE_BASE_URL = "https://api.example.com/v1";
      process.env.OPENAI_COMPATIBLE_API_KEY = "dummy";
      process.env.GITLAB_TOKEN = "dummy";
      process.env.GITLAB_PROJECT_ID = "123";

      const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("exit called");
      });

      expect(() => validateEnv()).toThrow("exit called");

      spyExit.mockRestore();
    });

    it("should pass if all required env vars exist for openai_compatible", () => {
      process.env.AI_PROVIDER = "openai_compatible";
      process.env.OPENAI_COMPATIBLE_BASE_URL = "https://api.example.com/v1";
      process.env.OPENAI_COMPATIBLE_API_KEY = "dummy";
      process.env.OPENAI_COMPATIBLE_MODEL = "test-model";
      process.env.GITLAB_TOKEN = "dummy";
      process.env.GITLAB_PROJECT_ID = "123";

      expect(() => validateEnv()).not.toThrow();
    });
  });

  describe("with openrouter provider", () => {
    it("should exit if OPENROUTER_API_KEY is missing", () => {
      delete process.env.OPENROUTER_API_KEY;
      process.env.AI_PROVIDER = "openrouter";
      process.env.GITLAB_TOKEN = "dummy";
      process.env.GITLAB_PROJECT_ID = "123";

      const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("exit called");
      });

      expect(() => validateEnv()).toThrow("exit called");

      spyExit.mockRestore();
    });

    it("should pass if all required env vars exist for openrouter", () => {
      process.env.AI_PROVIDER = "openrouter";
      process.env.OPENROUTER_API_KEY = "dummy";
      process.env.GITLAB_TOKEN = "dummy";
      process.env.GITLAB_PROJECT_ID = "123";

      expect(() => validateEnv()).not.toThrow();
    });
  });

  it("should exit for unknown provider", () => {
    process.env.AI_PROVIDER = "unknown";
    process.env.GITLAB_TOKEN = "dummy";
    process.env.GITLAB_PROJECT_ID = "123";

    const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit called");
    });

    expect(() => validateEnv()).toThrow("exit called");

    spyExit.mockRestore();
  });
});
