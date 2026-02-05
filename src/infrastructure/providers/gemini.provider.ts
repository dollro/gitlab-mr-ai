import { GoogleGenAI } from "@google/genai";
import { Env } from "../../config/env";
import { AIProvider, SummaryResult } from "../../types/ai-provider.types";
import fs from "fs/promises";
import path from "path";

/**
 * Google Gemini AI provider implementation
 */
export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private ai: GoogleGenAI;

  constructor() {
    if (!Env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required for Gemini provider");
    }
    this.ai = new GoogleGenAI({ apiKey: Env.GEMINI_API_KEY });
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

    const response = await this.ai.models.generateContent({
      model: Env.GEMINI_MODEL,
      contents: finalPrompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("No response text from Gemini API.");
    }

    return this.parseResponse(text);
  }

  private parseResponse(text: string): SummaryResult {
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
