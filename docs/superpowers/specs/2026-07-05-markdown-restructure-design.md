# Markdown Knowledge-Base Restructure - Design

Date: 2026-07-05
Status: Approved (design), pending spec review

## Goal

Restructure ~24 loose note files in the repo root into a coherent, Neovim-native
personal knowledge base optimized for information retrieval. Retain all information;
reorganize by purpose, deduplicate across files, and standardize formatting.

## Non-Goals

- No dashboard, no HTML, no build step. Files are consumed directly in Neovim and on GitHub.
- Do not touch the web app (`frontend/`, `backend/`, `render.yaml`, `Dockerfile`, `images/`, config files).
- No rewording of substance. Only reorganize, deduplicate, and reformat.

## Hard Constraints

1. **Zero information loss.** Every entry in every source file must land somewhere in the
   new structure. Deletion is only allowed when it is an exact duplicate whose information
   survives in its chosen home.
2. **No emojis, no em dashes** (use hyphens or colons) - per project conventions.
3. **Preserve all URLs, handles, dates, and status markers.**
4. When a fragment's home is ambiguous, route it to the closest-purpose file rather than
   dropping it. Prefer keeping data over perfect placement.

## Target Structure

```
README.md                      # Hub: links + one-liner to every file (gf-navigable)
reference/                     # Look things up
  social-hub.md                # <- main.md
  dev-tools.md                 # <- tools.md
  ai-tools.md                  # <- ai_sorcery.md
  reading-list.md              # <- digest.md (+ learning-resource dumps from URGENT.md)
  courses.md                   # <- oreilly_courses.md
cheatsheets/                   # How-to recall
  git.md                       # <- github_learning.md
  neovim.md                    # <- neovim_bindings.md
  linux.md                     # <- ubuntu_stuff.md + virtual_environment_arch_linx.txt
action/                        # Things to do / track
  deadlines.md                 # <- deadlines.md + preparations.md
  tasks.md                     # <- URGENT.md + do_or_dda.md + strides.txt + things_to_catch_upon.txt
  subscriptions.md             # <- CREDIT_CARD_BILLING.md
ideas/                         # Reflect / aspire
  projects.md                  # <- anticipated_projects.md (+ project ideas from URGENT.md)
  research-interests.md        # <- concepts.txt + comp_bio.md + strides.txt (learning parts)
  vision.md                    # <- mind.md (aspirational parts)
network/                       # People & orgs
  people.md                    # <- people.txt (+ people from mind.md)
  companies.md                 # <- dream_companies.txt
  job-descriptions.md          # <- job_desc.md
```

Result: 24 source files -> 17 destination files + README, grouped by 5 purposes.

## Source-to-Destination Routing

Clean single-purpose files map 1:1 (rename + reformat only):

| Source | Destination |
|--------|-------------|
| main.md | reference/social-hub.md |
| tools.md | reference/dev-tools.md |
| ai_sorcery.md | reference/ai-tools.md |
| digest.md | reference/reading-list.md |
| oreilly_courses.md | reference/courses.md |
| github_learning.md | cheatsheets/git.md |
| neovim_bindings.md | cheatsheets/neovim.md |
| anticipated_projects.md | ideas/projects.md |
| CREDIT_CARD_BILLING.md | action/subscriptions.md |
| people.txt | network/people.md |
| dream_companies.txt | network/companies.md |
| job_desc.md | network/job-descriptions.md |

Merges (multiple sources into one destination):

| Destination | Sources |
|-------------|---------|
| cheatsheets/linux.md | ubuntu_stuff.md + virtual_environment_arch_linx.txt |
| action/deadlines.md | deadlines.md + preparations.md |
| action/tasks.md | do_or_dda.md + things_to_catch_upon.txt + task parts of URGENT.md + strides.txt |
| ideas/research-interests.md | concepts.txt + comp_bio.md + learning/interest parts of strides.txt |

Split files (one messy source fanned out to proper homes):

**URGENT.md** (mixed dump) splits as:
- Numbered action items + dated priorities + "share your work" reminders + upcoming events -> action/tasks.md and action/deadlines.md (dated items with status go to deadlines)
- Cryo-ET competition + onboarding project concepts (TomoTwin, DeepFinder, nnU-Net, MONAI) -> ideas/projects.md
- ML knowledge notebooks, Math-for-ML resources, local-LLM run checklist, mechanistic-interp reading -> reference/reading-list.md
- Model/tool/platform lists (media models, LLMs, inference, cloud, editors, memory) -> reference/ai-tools.md
- Languages list -> ideas/research-interests.md (skills to build)

**mind.md** (mixed dump) splits as:
- Named people (Rukai Peng, Koki Mashita, Joe Nagai, Eurisko Fella, Barbie) -> network/people.md
- Resource pointers (Anna's Archive, FMHY, NPR, Hackaday) -> reference/reading-list.md
- Field interests (neuroscience, biology, astrophysics, aerospace, shaders) -> ideas/research-interests.md
- Aspirational/life goals (aesthetic house, entrepreneurship, kids/foundations, target countries) -> ideas/vision.md

**strides.txt** (mixed) splits as:
- Actionable items (PRs, competitions, applications, hackathons) -> action/tasks.md
- Learning topics + interests -> ideas/research-interests.md
- Languages/libs/compilers/profiling tools -> reference/dev-tools.md

## Deduplication Policy

Known cross-file overlaps to consolidate into a single best home, leaving a brief
`See also:` pointer where content is removed:

- **Julia ecosystem** (main.md, tools.md, comp_bio.md, do_or_dda.md) -> canonical in reference/dev-tools.md; interests/projects reference it.
- **Medical imaging** (main.md, anticipated_projects.md, tools.md, comp_bio.md, preparations.md) -> reference lists in reference/dev-tools.md; project proposals in ideas/projects.md; interests in ideas/research-interests.md.
- **GPU/cloud compute** (main.md, ai_sorcery.md, tools.md) -> canonical in reference/ai-tools.md (cloud compute) and reference/dev-tools.md.
- **Job boards / opportunities** (main.md, tools.md, ai_sorcery.md, dream_companies.txt) -> reference lists stay in their reference file; active applications -> action/deadlines.md.
- **MATS / ARENA / alignment programs** (main.md, deadlines.md, preparations.md) -> program deadlines in action/deadlines.md; general resources in reference.

When deduping, keep the richest version (most context / working link) and delete the thinner copies.

## Formatting Standard (applied to every file)

- **Headings:** `#` file title, `##` category, `###` subcategory. Consistent so Neovim
  fold (`zM`, `za`) yields a clean outline.
- **Table of Contents** at the top of any file with 3+ `##` sections, using GitHub anchors.
- **Reference data -> tables** (aligned columns, padded for raw readability).
- **Tasks -> checklists:** `- [ ]` open, `- [x]` done. Standardize the current mess
  (`[ X ]`, `= [ ]`, `[ x ]`) to `- [x]` / `- [ ]`.
- **Status -> plain-text tags:** `(done)`, `(ongoing)`, `(elapsed)`, `(upcoming)`.
  No emojis.
- **Raw URL dumps -> link tables or bulleted markdown links** with a label.
- **Dates -> ISO-ish, consistent** (e.g. `2025-12`), preserving original wording in parens
  if ambiguous.

## Bug Fixes Found During Analysis

- `main.md:54` - literal `n` breaking the Messaging table row (should be a newline between
  the header separator and the Signal row).
- `deadlines.md` - inconsistent checkbox syntax (`[ X ]`, `= [ ]`, `[ x ]`, `[ ]`).
- `oreilly_courses.md:26` - trailing empty entry `23)`.
- Multiple `.txt` files use `------` separators and inconsistent numbering; normalize.

## README Hub

Root `README.md` becomes the navigation index:
- Short intro line (keep the existing spirit).
- A section per purpose folder, each listing its files as relative markdown links
  (so `gf` in Neovim jumps straight to them) with a one-line description each.
- Optional "Quick jump" list of the most-used files (deadlines, tasks, social-hub).

## Execution Order

1. Create folder structure (`reference/`, `cheatsheets/`, `action/`, `ideas/`, `network/`).
2. Handle 1:1 clean files first (rename + reformat) - lowest risk, validates formatting standard.
3. Handle merges.
4. Handle splits (URGENT.md, mind.md, strides.txt) - highest risk, most care.
5. Write README hub.
6. Delete old source files only after their content is confirmed routed.
7. Final verification: grep old files for unique tokens, confirm each appears in new structure.

## Verification

- After restructure, for a sample of unique tokens from each deleted source (URLs, handles,
  program names), grep the new tree to confirm presence. No token should vanish.
- `git status` review: confirm only intended files added/removed, app untouched.
