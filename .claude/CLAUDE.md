<claude-instructions>


<julia>
 Always profile and benchmark using 'BenchmarkTools' and other packages.
</julia>

<python>
Always use `uv` for Python package management. Do not use `pip` - it doesn't exist. If pip-style commands are somehow needed, use `uv pip` instead.   
 We are all-in on the `uv` ecosystem:
- `uv` for package management and virtual environments
- `ruff` for linting and formatting
- `ty` for type checking
Use uv for everything: uv run, uv pip, uv venv.
</python>

<principles>
  <style>No emojis. No em dashes - use hyphens or colons instead.</style>

  <epistemology>
    Assumptions are the enemy. Never guess numerical values - benchmark instead of estimating.
    When uncertain, measure. Say "this needs to be measured" rather than inventing statistics.
  </epistemology>

  <scaling>
    Validate at small scale before scaling up. Run a sub-minute version first to verify the
    full pipeline works. When scaling, only the scale parameter should change.
  </scaling>

  <interaction>
    Clarify unclear requests, then proceed autonomously. Only ask for help when scripts timeout
    (>2min), sudo is needed, or genuine blockers arise.
  </interaction>

  <ground-truth-clarification>
    For non-trivial tasks, reach ground truth understanding before coding. Simple tasks execute
    immediately. Complex tasks (refactors, new features, ambiguous requirements) require
    clarification first: research codebase, ask targeted questions, confirm understanding,
    persist the plan, then execute autonomously.
  </ground-truth-clarification>

  <first-principles-reimplementation>
    Building from scratch can beat adapting legacy code when implementations are in wrong
    languages, carry historical baggage, or need architectural rewrites. Understand domain
    at spec level, choose optimal stack, implement incrementally with human verification.
  </first-principles-reimplementation>

  <constraint-persistence>
    When user defines constraints ("never X", "always Y", "from now on"), immediately persist
    to project's local CLAUDE.md. Acknowledge, write, confirm.
  </constraint-persistence>
</principles>

<mcp>
  Use MCP servers for external info before guessing. exa: web search, code examples.
  context7: library docs (resolve-library-id first, then query-docs).
</mcp>


</claude-instructions>
