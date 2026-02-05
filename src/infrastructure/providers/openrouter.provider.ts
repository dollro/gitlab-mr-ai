import { Env } from "../../config/env";
import {
  OpenAICompatibleProvider,
  OpenAICompatibleConfig,
} from "./openai-compatible.provider";

/**
 * OpenRouter AI provider implementation
 * OpenRouter provides access to multiple AI models through an OpenAI-compatible API
 * This is a convenience preset that extends OpenAICompatibleProvider with OpenRouter defaults
 * @see https://openrouter.ai/docs
 */
export class OpenRouterProvider extends OpenAICompatibleProvider {
  override readonly name = "openrouter";

  constructor() {
    if (!Env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is required for OpenRouter provider");
    }

    const config: OpenAICompatibleConfig = {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: Env.OPENROUTER_API_KEY,
      model: Env.OPENROUTER_MODEL,
      headers: {
        "HTTP-Referer":
          Env.OPENROUTER_SITE_URL ||
          "https://github.com/somnus-stasis/gitlab-mr-ai",
        "X-Title": Env.OPENROUTER_APP_NAME || "gitlab-mr-ai",
      },
    };

    super(config);
  }
}
