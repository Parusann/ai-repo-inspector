import { describe, expect, it } from "vitest";
import { toReviewRequest } from "../src/mcp-adapter.js";

describe("MCP request mapping", () => {
  it("forwards the declared repo_path field to the review core", () => {
    expect(toReviewRequest({ repo_path: "/work/requested" })).toEqual({
      repositoryPath: "/work/requested",
      baseRef: undefined,
      validationCommands: undefined,
    });
  });
});
