import dotenv from "dotenv";
import { AIProviderType } from "../types/ai-provider.types";

dotenv.config();

export const Env = {
  // AI Provider Selection
  AI_PROVIDER: (process.env.AI_PROVIDER || "gemini") as AIProviderType,

  // Gemini Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-1.5-flash",

  // Generic OpenAI-Compatible Configuration
  OPENAI_COMPATIBLE_BASE_URL: process.env.OPENAI_COMPATIBLE_BASE_URL || "",
  OPENAI_COMPATIBLE_API_KEY: process.env.OPENAI_COMPATIBLE_API_KEY || "",
  OPENAI_COMPATIBLE_MODEL: process.env.OPENAI_COMPATIBLE_MODEL || "gpt-4",
  OPENAI_COMPATIBLE_HEADERS: process.env.OPENAI_COMPATIBLE_HEADERS || "",

  // OpenRouter Configuration (preset for openai_compatible)
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
  OPENROUTER_SITE_URL: process.env.OPENROUTER_SITE_URL || "",
  OPENROUTER_APP_NAME: process.env.OPENROUTER_APP_NAME || "gitlab-mr-ai",

  // GitLab Configuration
  GITLAB_TOKEN: process.env.GITLAB_TOKEN || "",
  GITLAB_API_URL: process.env.GITLAB_API_URL || "https://gitlab.com/api/v4",
  GITLAB_PROJECT_ID: process.env.GITLAB_PROJECT_ID || "",
};
