import { spawn } from "node:child_process";
import type { ValidationResult } from "./types.js";

const VALIDATION_TIMEOUT_MS = 60_000;
const MAX_VALIDATION_OUTPUT = 64 * 1024;

export function parseCommandLine(command: string): [string, string[]] {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | undefined;

  for (let index = 0; index < command.length; index++) {
    const character = command[index];
    if (quote && character === "\\" && command[index + 1] === quote) {
      current += quote;
      index++;
    } else if (character === "'" || character === '"') {
      if (quote === character) quote = undefined;
      else if (!quote) quote = character;
      else current += character;
    } else if (/\s/.test(character) && !quote) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += character;
    }
  }

  if (quote) throw new Error("Validation command contains an unterminated quote.");
  if (current) tokens.push(current);
  if (!tokens.length) throw new Error("Validation command cannot be empty.");
  return [tokens[0], tokens.slice(1)];
}

function windowsExecutable(executable: string): string {
  if (process.platform === "win32" && ["npm", "npx", "pnpm", "yarn"].includes(executable)) {
    return `${executable}.cmd`;
  }
  return executable;
}

export function runValidation(command: string, cwd: string): Promise<ValidationResult> {
  return new Promise((resolve) => {
    let executable: string;
    let args: string[];
    try {
      [executable, args] = parseCommandLine(command);
    } catch (error) {
      resolve({ command, status: "failed", output: String(error) });
      return;
    }

    const child = spawn(windowsExecutable(executable), args, {
      cwd,
      shell: false,
      windowsHide: true,
    });
    let output = "";
    let truncated = false;
    let timedOut = false;

    const capture = (chunk: Buffer) => {
      if (output.length >= MAX_VALIDATION_OUTPUT) {
        truncated = true;
        return;
      }
      const remaining = MAX_VALIDATION_OUTPUT - output.length;
      const text = chunk.toString("utf8");
      output += text.slice(0, remaining);
      if (text.length > remaining) truncated = true;
    };
    child.stdout.on("data", capture);
    child.stderr.on("data", capture);

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, VALIDATION_TIMEOUT_MS);

    let spawnError: Error | undefined;
    child.on("error", (error) => {
      spawnError = error;
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (spawnError) output += `${output ? "\n" : ""}${spawnError.message}`;
      if (truncated) output += `\n[validation output truncated at ${MAX_VALIDATION_OUTPUT} characters]`;
      if (timedOut) output += `\n[validation timed out after ${VALIDATION_TIMEOUT_MS} ms]`;
      resolve({
        command,
        status: code === 0 && !spawnError && !timedOut ? "passed" : "failed",
        output,
      });
    });
  });
}

export async function runValidations(commands: string[], cwd: string): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  for (const command of commands) {
    results.push(await runValidation(command, cwd));
  }
  return results;
}
