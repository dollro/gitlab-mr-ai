import { AIProviderType } from "../types/ai-provider.types";

/**
 * Validates that all required environment variables are set based on the selected AI provider
 */
export function validateEnv(): void {
  const provider = (process.env.AI_PROVIDER || "gemini") as AIProviderType;

  // GitLab vars are always required
  const requiredVars: string[] = ["GITLAB_TOKEN", "GITLAB_PROJECT_ID"];

  // Add provider-specific required vars
  switch (provider) {
    case "gemini":
      requiredVars.push("GEMINI_API_KEY");
      break;
    case "openai_compatible":
      requiredVars.push(
        "OPENAI_COMPATIBLE_BASE_URL",
        "OPENAI_COMPATIBLE_API_KEY",
        "OPENAI_COMPATIBLE_MODEL"
      );
      break;
    case "openrouter":
      requiredVars.push("OPENROUTER_API_KEY");
      break;
    default:
      console.error(
        `❌ Unknown AI_PROVIDER: ${provider}. Supported: gemini, openai_compatible, openrouter`
      );
      process.exit(1);
  }

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required .env variables: ${missing.join(", ")}`);
    console.error(`   Selected AI provider: ${provider}`);
    process.exit(1);
  }
}
