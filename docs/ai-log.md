# AI collaboration log

This log records material human and AI contributions as they happen. It is evidence for the submission, not a reconstructed narrative.

## 2026-08-17 17:08 ET — Scope and execution start

- **Candidate contribution:** Supplied the prior findings inventory, priority order, hybrid-interface thesis, verification plan, and instruction to execute the assessment end to end. The candidate remained available for authentication or judgment calls.
- **AI-agent contribution:** Started the timed execution session, re-read the official starter instructions, confirmed the 90-focused-minute rule, and created a fresh local repository from the current template contents.
- **Verification:** The fresh repository was initialized on `main`; after the public template repository was created, the work was replayed onto its unchanged initial template commit `9b0ca86` before publication.
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

## 2026-08-17 17:18 ET — Model-facing output boundary

- **Candidate contribution:** The prior plan identified Markdown fence breakout and unbounded model-context output as a priority-one trust-boundary problem.
- **AI-agent contribution:** Added adaptive Markdown fences, safe inline-code delimiters for paths and commands, validation status labels, a repository-data warning, and a 32,000-character MCP cap.
- **Verification:** Tests cover a filename containing a backtick, output containing a triple-backtick fence plus instruction-like text, and a fixed-size response ending in `inspector-output-truncated` with original and limit lengths.
- **Correction or rejection:** The agent selected an explicit HTML-comment truncation marker instead of a silent cut. It is readable by a model, preserves valid Markdown better than a bare suffix, and exposes both the original and returned limits.

## 2026-08-17 17:21 ET — Git change parsing

- **Candidate contribution:** The prior plan grouped rename parsing, CRLF handling, exotic filenames, default-branch resolution, and option-like base refs as one class of Git-boundary defects.
- **AI-agent contribution:** Switched to NUL-delimited `git diff` output, represented rename/copy source paths explicitly, resolved `main` or `master` instead of hardcoding one branch, verified requested refs, and terminated diff revisions with `--`.
- **Verification:** A generated repository whose directory contains spaces uses `master`, renames a spaced filename, and adds a backtick/hash filename. Tests assert the exact structured result and reject an option-like base ref.
- **Correction or rejection:** The agent followed the candidate's rejection of a narrow `.split(/\\r?\\n/)` patch. NUL-delimited output addresses CRLF and valid filenames containing newlines as one protocol-level fix.

## 2026-08-17 17:24 ET — CLI contract and packaging

- **Candidate contribution:** The prior inventory identified the spaced-path truncation, inert JSON flag, and package binary pointing at a file the build did not produce.
- **AI-agent contribution:** Preserved already-tokenized CLI paths, validated formats, implemented JSON output, selected the matching report extension, and introduced a source-only build configuration so `dist/cli.js` matches the package `bin` field. Tests now exclude generated build output.
- **Verification:** Unit tests cover a spaced repository path, invalid format rejection, and parseable JSON. The final gate checks that `dist/cli.js` exists and that the CLI runs against the edge-case fixture.
- **Correction or rejection:** None in this step.

## 2026-08-17 17:28 ET — Self-review of truncation behavior

- **Candidate contribution:** Required evidence-backed review rather than stopping when the first test suite passed.
- **AI-agent contribution:** Re-read the boundary code and found two edge cases: a later output chunk could be dropped without setting the validation truncation flag, and a final MCP character cut could leave its marker inside an open Markdown fence.
- **Verification:** Added an over-limit process-output test. Truncated MCP reports now put the machine-readable marker before an HTML-escaped preview in a closed `<pre>` block, with the existing fixed-length assertion still enforced.
- **Correction or rejection:** The agent corrected its own first truncation implementation after review. This is recorded as agent self-correction, not attributed to the candidate.

## 2026-08-17 17:29 ET — Publication and final gate

- **Candidate contribution:** Completed GitHub's device authorization when the saved credential was found to be invalid.
- **AI-agent contribution:** Created the public repository from the official Xsolla template, replayed the verified commits onto its unchanged template commit, scanned tracked content for tokens, machine paths, and fixture data, pushed the work, and monitored GitHub Actions.
- **Verification:** The final local gate passed typecheck, build, and 15 tests across five files. [Public checks run 32071313675](https://github.com/Parusann/ai-repo-inspector/actions/runs/32071313675) passed `npm ci`, typecheck, build, and tests on Ubuntu.
- **Correction or rejection:** None in this step.
