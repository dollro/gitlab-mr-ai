import OpenAI from "openai";
import { AIProvider, SummaryResult } from "../../types/ai-provider.types";
import fs from "fs/promises";
import path from "path";

export interface OpenAICompatibleConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  headers?: Record<string, string>;
}

/**
 * Generic OpenAI-compatible API provider
 * Works with any API that implements the OpenAI chat completions format
 * Examples: OpenRouter, Together AI, Groq, Ollama, OpenAI itself
 */
export class OpenAICompatibleProvider implements AIProvider {
  readonly name: string = "openai_compatible";
  protected client: OpenAI;
  protected model: string;

  constructor(config: OpenAICompatibleConfig) {
    if (!config.apiKey) {
      throw new Error("API key is required for OpenAI-compatible provider");
    }
    if (!config.baseURL) {
      throw new Error("Base URL is required for OpenAI-compatible provider");
    }
    this.client = new OpenAI({
      baseURL: config.baseURL,
      apiKey: config.apiKey,
      defaultHeaders: config.headers,
    });
    this.model = config.model;
  }

  async generateSummary(
    promptPath: string,
    changesJson: any[]
  ): Promise<SummaryResult> {
    const promptBase = await fs.readFile(path.resolve(promptPath), "utf-8");
    const finalPrompt = `${promptBase}\n\nHere is the list of changes as JSON:\n\n${JSON.stringify(
      changesJson,
      null,
      2
    )}`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("No response text from OpenAI-compatible API.");
    }

    return this.parseResponse(text);
  }

  protected parseResponse(text: string): SummaryResult {
    let cleaned = text;

    // Strip ```json ... ``` if present
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    }

    const parsed = JSON.parse(cleaned);

    return {
      title: parsed.title,
      description: parsed.description,
      keyChanges: parsed.keyChanges,
    };
  }
}
