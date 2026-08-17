import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { changedFiles, resolveBaseRef } from "../src/git.js";

const temporaryRepositories: string[] = [];

function git(repository: string, ...args: string[]) {
  execFileSync("git", args, { cwd: repository, stdio: "ignore" });
}

function fixtureRepository(): string {
  const repository = mkdtempSync(join(tmpdir(), "inspector fixture with space "));
  temporaryRepositories.push(repository);
  git(repository, "init", "-b", "master");
  git(repository, "config", "user.name", "Inspector Test");
  git(repository, "config", "user.email", "inspector@example.invalid");
  mkdirSync(join(repository, "src"));
  writeFileSync(join(repository, "src", "old name.txt"), "original\n");
  git(repository, "add", ".");
  git(repository, "commit", "-m", "fixture baseline");
  git(repository, "switch", "-c", "fixture-work");
  renameSync(join(repository, "src", "old name.txt"), join(repository, "src", "new name.txt"));
  writeFileSync(join(repository, "src", "tick`name#.txt"), "edge\n");
  git(repository, "add", ".");
  git(repository, "commit", "-m", "fixture changes");
  return repository;
}

afterEach(() => {
  for (const repository of temporaryRepositories.splice(0)) {
    rmSync(repository, { recursive: true, force: true });
  }
});

describe("git change inspection", () => {
  it("resolves master and parses NUL-delimited rename and exotic paths", () => {
    const repository = fixtureRepository();

    expect(resolveBaseRef(repository)).toBe("master");
    expect(changedFiles(repository)).toEqual([
      {
        previousPath: "src/old name.txt",
        path: "src/new name.txt",
        status: "renamed",
      },
      { path: "src/tick`name#.txt", status: "added" },
    ]);
  });

  it("rejects option-like base refs before invoking diff", () => {
    const repository = fixtureRepository();
    expect(() => resolveBaseRef(repository, "--output=/tmp/nope")).toThrow("Invalid base ref");
  });
});
