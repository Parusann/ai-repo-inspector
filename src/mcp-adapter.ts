import { z } from "zod";
import type { ReviewRequest } from "./types.js";

export const reviewToolShape = {
  repo_path: z.string().describe("Repository path to inspect."),
  baseRef: z.string().optional(),
  validationCommands: z.array(z.string()).optional(),
};

export type ReviewToolInput = z.infer<z.ZodObject<typeof reviewToolShape>>;

export function toReviewRequest(input: ReviewToolInput): ReviewRequest {
  return {
    repositoryPath: input.repo_path,
    baseRef: input.baseRef,
    validationCommands: input.validationCommands,
  };
}
