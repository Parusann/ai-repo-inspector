#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { reviewRepository } from "./core.js";

type Args = {
  command: string;
  repositoryPath?: string;
  baseRef?: string;
  format?: "markdown" | "json";
  validations: string[];
};

export function parseArgs(argv: string[]): Args {
  const args: Args = { command: argv[0] ?? "", validations: [] };
  for (let index = 1; index < argv.length; index++) {
    const token = argv[index];
    if (token === "--repo") {
      args.repositoryPath = argv[++index];
    } else if (token === "--base-ref") {
      args.baseRef = argv[++index];
    } else if (token === "--format") {
      const format = argv[++index];
      if (format !== "markdown" && format !== "json") {
        throw new Error(`Unsupported format: ${format ?? "(missing)"}`);
      }
      args.format = format;
    } else if (token === "--validate") {
      const validation = argv[++index];
      if (!validation) throw new Error("--validate requires a command.");
      args.validations.push(validation);
    }
  }
  return args;
}

export async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command !== "review" || !args.repositoryPath) {
    console.error("Usage: inspector review --repo <path> [--base-ref <ref>] [--validate <command>]");
    process.exitCode = 1;
    return;
  }

  const report = await reviewRepository({
    repositoryPath: args.repositoryPath,
    baseRef: args.baseRef,
    validationCommands: args.validations,
    format: args.format,
  });
  const outputPath = args.format === "json" ? "review-report.json" : "review-report.md";
  writeFileSync(outputPath, report, "utf8");
  console.log(`Review report written to ${outputPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exitCode = 1;
  });
}
