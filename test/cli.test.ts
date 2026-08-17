import { describe, expect, it } from "vitest";
import { parseArgs } from "../src/cli.js";

describe("CLI argument parsing", () => {
  it("preserves a repository path containing spaces", () => {
    expect(parseArgs(["review", "--repo", "C:/work/repo with space", "--format", "json"]))
      .toMatchObject({
        command: "review",
        repositoryPath: "C:/work/repo with space",
        format: "json",
      });
  });

  it("rejects an advertised format it cannot produce", () => {
    expect(() => parseArgs(["review", "--repo", "/work/repo", "--format", "xml"]))
      .toThrow("Unsupported format: xml");
  });
});
