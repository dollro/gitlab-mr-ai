import { summarizeFromDiff } from "../../../src/core/summarize/summarizeFromDiff";

jest.mock("../../../src/infrastructure/providers", () => ({
  getAIProvider: jest.fn(() => ({
    name: "mock-provider",
    generateSummary: jest.fn(() =>
      Promise.resolve({
        title: "Mocked Title",
        description: "Mocked description from AI Provider",
        keyChanges: ["- file1.ts: updated logic", "- file2.ts: fixed bug"],
      })
    ),
  })),
}));

describe("summarizeFromDiff", () => {
  it("should return summary description and keyChanges from mocked AI provider", async () => {
    const mockDiff = [{ new_path: "file1.ts", diff: "+ some code" }];
    const result = await summarizeFromDiff(mockDiff, "summary-base.txt");

    expect(result.description).toBe("Mocked description from AI Provider");
    expect(result.keyChanges).toContain("file1.ts");
  });
});
