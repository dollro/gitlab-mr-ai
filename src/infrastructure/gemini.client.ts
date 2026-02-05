/**
 * @deprecated This file is maintained for backward compatibility.
 * Use `import { getAIProvider } from './providers'` instead.
 */
import { GeminiProvider } from "./providers/gemini.provider";

const provider = new GeminiProvider();

/**
 * @deprecated Use `getAIProvider().generateSummary()` instead.
 */
export async function generateSummaryFromChanges(
  promptPath: string,
  changesJson: any[]
): Promise<{ title: string; description: string; keyChanges: string[] }> {
  return provider.generateSummary(promptPath, changesJson);
}
