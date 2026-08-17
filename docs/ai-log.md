# AI collaboration log

This log records material human and AI contributions as they happen. It is evidence for the submission, not a reconstructed narrative.

## 2026-08-17 17:08 ET — Scope and execution start

- **Candidate contribution:** Supplied the prior findings inventory, priority order, hybrid-interface thesis, verification plan, and instruction to execute the assessment end to end. The candidate remained available for authentication or judgment calls.
- **AI-agent contribution:** Started the timed execution session, re-read the official starter instructions, confirmed the 90-focused-minute rule, and created a fresh local repository from the current template contents.
- **Verification:** The fresh repository was initialized on `main` and committed as template commit `4cea075` before any product changes.
- **Correction or rejection:** None in this step.

## 2026-08-17 17:10 ET — Baseline and first contract fix

- **Candidate contribution:** The supplied plan prioritized the silent MCP repository mismatch ahead of broader cleanup and required a before/after JSON-RPC transcript.
- **AI-agent contribution:** Installed dependencies, captured the baseline, reproduced the MCP mismatch over raw JSON-RPC, and implemented a typed adapter that maps the public `repo_path` field to the core request.
- **Verification:** Before the fix, a valid request for the upstream reference clone returned `# Review Report: undefined`. The regression test asserts the declared field reaches the core as `/work/requested`.
- **Correction or rejection:** The agent did not apply the tempting one-line rename inside an `any`-typed callback. It moved the mapping into a Zod-derived typed boundary so future schema drift is compile-time visible. This was a decision already identified in the candidate's prior plan, then re-verified against the source.

## 2026-08-17 17:14 ET — Failed validations and shell boundary

- **Candidate contribution:** The prior plan required failed checks to remain visible in the report and called for removing shell execution while retaining CLI validation capability.
- **AI-agent contribution:** Replaced `exec` with bounded `spawn(..., { shell: false })`, added a small quoted-argument parser, and made non-zero exits return `status: "failed"` instead of aborting the review.
- **Verification:** Regression tests execute both a passing Node command and a benign command that prints `expected failure` and exits 7. A separate assertion confirms a quoted argument remains one argument.
- **Correction or rejection:** None in this step; the implementation follows the already selected trust-boundary direction.

## 2026-08-17 17:16 ET — MCP capability allowlist

- **Candidate contribution:** Selected a hybrid interface with an asymmetric trust boundary: developers retain CLI validation commands, while model callers receive a smaller capability set.
- **AI-agent contribution:** Replaced MCP's arbitrary `validationCommands` input with the named checks `typecheck`, `test`, and `build`, made the input schema strict, and documented the limitation in the tool description.
- **Verification:** Adapter tests prove named checks map to expected commands and the former arbitrary-command field fails schema validation.
- **Correction or rejection:** The agent chose whole-call rejection for an allowlist miss. A refused capability should be unmistakable; silently ignoring it could make an agent believe a check ran when it did not.
