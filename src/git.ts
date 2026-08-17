import { execFileSync } from "node:child_process";
import type { ChangedFile } from "./types.js";

function git(repositoryPath: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd: repositoryPath,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function verifiedRef(repositoryPath: string, ref: string): boolean {
  if (!ref || ref.startsWith("-")) return false;
  try {
    git(repositoryPath, ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

export function resolveBaseRef(repositoryPath: string, requested?: string): string {
  if (requested) {
    if (!verifiedRef(repositoryPath, requested)) throw new Error(`Invalid base ref: ${requested}`);
    return requested;
  }

  try {
    const remoteDefault = git(repositoryPath, [
      "symbolic-ref",
      "--quiet",
      "--short",
      "refs/remotes/origin/HEAD",
    ]).trim();
    if (verifiedRef(repositoryPath, remoteDefault)) return remoteDefault;
  } catch {
    // A local-only repository has no remote default branch.
  }

  for (const candidate of ["main", "master"]) {
    if (verifiedRef(repositoryPath, candidate)) return candidate;
  }

  return git(repositoryPath, ["rev-list", "--max-parents=0", "HEAD"]).trim().split(/\r?\n/)[0];
}

export function changedFiles(repositoryPath: string, baseRef?: string): ChangedFile[] {
  const base = resolveBaseRef(repositoryPath, baseRef);
  const fields = git(repositoryPath, [
    "diff",
    "--name-status",
    "-z",
    "--find-renames",
    `${base}...HEAD`,
    "--",
  ]).split("\0");
  if (!fields.at(-1)) fields.pop();

  const files: ChangedFile[] = [];
  for (let index = 0; index < fields.length; ) {
    const code = fields[index++];
    const kind = code[0];
    if (kind === "R" || kind === "C") {
      const previousPath = fields[index++];
      const path = fields[index++];
      files.push({ path, previousPath, status: kind === "R" ? "renamed" : "copied" });
      continue;
    }

    const path = fields[index++];
    const status: ChangedFile["status"] =
      kind === "A"
        ? "added"
        : kind === "D"
          ? "deleted"
          : kind === "T"
            ? "typechanged"
            : kind === "U"
              ? "unmerged"
              : "modified";
    files.push({ path, status });
  }
  return files;
}
