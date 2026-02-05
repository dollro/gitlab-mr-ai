import path from "path";
import { getAIProvider } from "../../infrastructure/providers";

export async function summarizeFromDiff(
  diffJson: any[],
  promptInput: string = "summary-base.txt"
) {
  const isCustomPath = promptInput.includes("/") || promptInput.includes("\\");
  const promptPath = isCustomPath
    ? path.resolve(promptInput)
    : path.resolve(__dirname, "../../prompts", promptInput);

  const provider = getAIProvider();
  const summary = await provider.generateSummary(promptPath, diffJson);

  return {
    description: summary.description,
    keyChanges: summary.keyChanges.join("\n"),
  };
}
