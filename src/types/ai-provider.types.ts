/**
 * Result returned by AI providers for MR summarization
 */
export interface SummaryResult {
  title: string;
  description: string;
  keyChanges: string[];
}

/**
 * Abstract interface for AI providers
 * Implement this interface to add support for new AI providers
 */
export interface AIProvider {
  /**
   * Provider name for logging and debugging
   */
  readonly name: string;

  /**
   * Generate a summary from code changes
   * @param promptPath - Path to the prompt template file
   * @param changesJson - Array of change objects from GitLab diff
   * @returns Structured summary with title, description, and key changes
   */
  generateSummary(
    promptPath: string,
    changesJson: any[]
  ): Promise<SummaryResult>;
}

/**
 * Supported AI provider types
 */
export type AIProviderType = "gemini" | "openai_compatible" | "openrouter";
