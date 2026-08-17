import { z } from "zod";
import type { ReviewRequest } from "./types.js";

const checkCommands = {
  typecheck: "npm run typecheck",
  test: "npm test",
  build: "npm run build",
} as const;

export const reviewToolSchema = z.object({
  repo_path: z.string().describe("Repository path to inspect."),
  baseRef: z.string().optional(),
  checks: z
    .array(z.enum(["typecheck", "test", "build"]))
    .optional()
    .describe("Allowlisted package checks to run. Arbitrary commands are not accepted."),
}).strict();

export type ReviewToolInput = z.infer<typeof reviewToolSchema>;

export function toReviewRequest(input: ReviewToolInput): ReviewRequest {
  return {
    repositoryPath: input.repo_path,
    baseRef: input.baseRef,
    validationCommands: input.checks?.map((check) => checkCommands[check]),
  };
}
