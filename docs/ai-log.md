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
