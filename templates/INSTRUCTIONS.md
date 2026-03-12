- Preserve existing project structure and naming conventions.

Instructions.md 

#Codex Instructions
#Purpose
These instructions define default behavior for AI coding assistance in this repository.
General Guidelines
- Prioritize correctness, readability, and maintainability over cleverness.
- Keep changes minimal and scoped to the request.
- Avoid introducing new dependencies unless clearly justified.

## Code Style

- Follow the style already used in the file being edited.

- Use clear, descriptive names for variables, functions, and classes.
- Prefer small, focused functions.

- Add comments only when logic is non-obvious.

## Safety and Reliability

- Never hardcode secrets, keys, tokens, or credentials.

- Validate inputs and handle errors explicitly.

- Prefer safe defaults and fail with actionable error messages.


- Avoid destructive operations unless explicitly requested.

#Testing
- Add or update tests for behavior changes when a test suite exists.
- Keep tests deterministic and easy to understand.
-Do not remove tests to make failures disappear.

## Documentation
- Update relevant documentation when behavior or usage changes.
- Keep README and inline docs aligned with implemented behavior.

## Pull Request Readiness

- Summarize what changed, why, and any tradeoffs.

- Ensure code builds and passes available checks before finalizing.
Highlight known limitations and follow-up itens.
##Communication Style
- Ask clarifying questions only when requirements are ambiguous or conflicting.

- Provide concise progress updates during larger tasks.

- When blocked, state the blocker and propose the next best option.