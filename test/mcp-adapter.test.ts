import { describe, expect, it } from "vitest";
import { reviewToolSchema, toReviewRequest } from "../src/mcp-adapter.js";

describe("MCP request mapping", () => {
  it("forwards the declared repo_path field to the review core", () => {
    expect(toReviewRequest({ repo_path: "/work/requested" })).toEqual({
      repositoryPath: "/work/requested",
      baseRef: undefined,
      validationCommands: undefined,
    });
  });

  it("maps only allowlisted check names to validation commands", () => {
    expect(toReviewRequest({ repo_path: "/work/requested", checks: ["test", "build"] }))
      .toMatchObject({ validationCommands: ["npm test", "npm run build"] });
  });

  it("rejects the former arbitrary-command input", () => {
    expect(
      reviewToolSchema.safeParse({
        repo_path: "/work/requested",
        validationCommands: ["node -e \"process.exit(0)\""],
      }).success,
    ).toBe(false);
  });
});
