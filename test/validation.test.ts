import { describe, expect, it } from "vitest";
import { parseCommandLine, runValidation } from "../src/validation.js";

describe("validation execution", () => {
  it("records a non-zero command as failed instead of rejecting the review", async () => {
    const result = await runValidation(
      `node -e "console.error('expected failure'); process.exit(7)"`,
      process.cwd(),
    );

    expect(result.status).toBe("failed");
    expect(result.output).toContain("expected failure");
  });

  it("records successful output", async () => {
    const result = await runValidation(`node -e "console.log('ok')"`, process.cwd());

    expect(result).toMatchObject({ status: "passed" });
    expect(result.output).toContain("ok");
  });

  it("parses quoted arguments without invoking a shell", () => {
    expect(parseCommandLine(`tool --flag "value with spaces"`)).toEqual([
      "tool",
      ["--flag", "value with spaces"],
    ]);
  });

  it("marks output that exceeds the validation capture limit", async () => {
    const result = await runValidation(
      `node -e "process.stdout.write('x'.repeat(70000))"`,
      process.cwd(),
    );

    expect(result.status).toBe("passed");
    expect(result.output).toContain("validation output truncated");
  });
});
