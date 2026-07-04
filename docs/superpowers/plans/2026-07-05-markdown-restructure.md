# Markdown Knowledge-Base Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure 24 loose root note files into a purpose-grouped, Neovim-native markdown knowledge base with zero information loss.

**Architecture:** Content is reorganized by purpose into 5 folders (`reference/`, `cheatsheets/`, `action/`, `ideas/`, `network/`) plus a `README.md` hub. Each task produces one final destination file. Original source files are left in place until a final cleanup task verifies (via grep) that all content survived, then deletes them. This keeps `git diff` reviewable and guarantees no data is dropped mid-flight.

**Tech Stack:** Plain markdown. Verification via `grep`/`rg`. No build step, no dependencies.

## Global Constraints

- **Zero information loss.** Every entry from every source lands in the new tree. Deletion allowed only for exact duplicates whose info survives in the canonical home.
- **No emojis. No em dashes** (use hyphens or colons).
- **Preserve all URLs, handles, dates, and status markers** verbatim.
- **Do not touch the web app:** `frontend/`, `backend/`, `render.yaml`, `backend/Dockerfile`, `images/`, `*.json`, `*.toml`, `*.yaml`, `*.yml`, `.python-version`, `*.mjs`, `*.css`, `Grafana`, `servers`, `hackathons.xlsx`, `.main.txt.un~`, `main.txt~`.
- **Formatting standard** (apply to every destination file):
  - Headings: `#` file title, `##` category, `###` subcategory.
  - Table of Contents at top of any file with 3+ `##` sections, using GitHub anchors.
  - Reference data -> aligned markdown tables. Tasks -> `- [ ]` / `- [x]`. Status -> plain-text tags `(done)` `(ongoing)` `(elapsed)` `(upcoming)`.
  - Raw URL dumps -> labeled link tables or bulleted markdown links.
- **Do not delete any source file until Task 20.**
- **Commits:** confirm with the user whether to commit per-task or leave uncommitted for `git diff` review. Default: leave uncommitted; do a single commit at the end if requested.

---

### Task 1: Scaffold folder structure

**Files:**
- Create: `reference/.gitkeep`, `cheatsheets/.gitkeep`, `action/.gitkeep`, `ideas/.gitkeep`, `network/.gitkeep`

- [ ] **Step 1: Create the five purpose folders**

```bash
cd /Users/dorachan/Desktop/social_presence
mkdir -p reference cheatsheets action ideas network
```

- [ ] **Step 2: Verify they exist**

Run: `ls -d reference cheatsheets action ideas network`
Expected: all five listed, no error.

---

### Task 2: reference/social-hub.md

**Files:**
- Create: `reference/social-hub.md`
- Source: `main.md`

**Transformation:**
- Keep the existing table structure (it is already good). Reformat per the standard.
- FIX BUG: `main.md:54` has a literal `n` merging the Messaging table header separator with the Signal row. Split into proper rows:
  ```
  | Platform | Contact |
  |----------|---------|
  | Signal | +919315431855 |
  | WhatsApp | +919315431855 |
  ```
- Keep all 30+ category sections, the "Saved Information Sources", "Reference Linktrees", and "Skills Reference Images" (image links stay pointing at `../images/...` since files move into `reference/`).
- Update image paths from `./images/...` to `../images/...`.
- Rebuild the Table of Contents anchors to match final headings.

- [ ] **Step 1: Read the source**

Run: `cat main.md`

- [ ] **Step 2: Write reference/social-hub.md** with all sections reformatted, the `:54` bug fixed, and image paths updated to `../images/`.

- [ ] **Step 3: Verify no content lost**

Run: `rg -c 'hurtbadly2|Gitter|society-rse|amouranth|swappy-20240706' reference/social-hub.md`
Expected: each unique token from the source present (nonzero count). Also confirm image path rewrite:
Run: `rg '\.\./images/' reference/social-hub.md | wc -l`
Expected: 6 (the six image references).

---

### Task 3: reference/dev-tools.md

**Files:**
- Create: `reference/dev-tools.md`
- Sources: `tools.md` (full) + `strides.txt` (Languages / libs / compilers / profiling-tools lines, `strides.txt:42-48`)

**Transformation:**
- Base is `tools.md`, already tabular; reformat per standard, keep every section including "Startup Research" and "Design Tools".
- Append/merge the toolchain lists from `strides.txt:42-48` (extended languages, libs, compilers, profiling tools) into a new `## Toolchain (extended)` section - these are richer than the `tools.md` language table, so add the extras (Fortran, Scala, Zig, Mojo, Haskell, Lua, Elm; Jax, llama.cpp; g++, clang++, nvc++, gfortran, nvfortran, dpc++; Valgrind, Maqao, Perf, NSight, Malt, Numaprof) without duplicating what `tools.md` already lists.

- [ ] **Step 1: Read sources**

Run: `cat tools.md; echo '---'; sed -n '42,48p' strides.txt`

- [ ] **Step 2: Write reference/dev-tools.md** with all `tools.md` sections plus the extended toolchain section.

- [ ] **Step 3: Verify**

Run: `rg -c 'ZBrush|SvelteJS|PostgreSQL|Numaprof|nvfortran|Valgrind|Wellfound' reference/dev-tools.md`
Expected: each token present.

---

### Task 4: reference/ai-tools.md

**Files:**
- Create: `reference/ai-tools.md`
- Sources: `ai_sorcery.md` (full) + `URGENT.md` model/tool/platform lists (`URGENT.md:88-99`)

**Transformation:**
- Base is `ai_sorcery.md`; keep every section including "Browser Tab Log", "Inspiration", "Domain Research Tips", and the image at bottom (update `./images/image1.png` -> `../images/image1.png`).
- Merge the `URGENT.md:88-99` lists (Media Modality Models, LLMs, AI inference, Cloud Platforms, Avatars, Editors, Locally, Memory, NoteTaking, hackathons, Upskilling, Daily productivity) into a `## Model and Platform Index` section, deduping against entries already in `ai_sorcery.md`.

- [ ] **Step 1: Read sources**

Run: `cat ai_sorcery.md; echo '---'; sed -n '88,99p' URGENT.md`

- [ ] **Step 2: Write reference/ai-tools.md** with the merged section and image path fixed.

- [ ] **Step 3: Verify**

Run: `rg -c 'Qwen-Code|WindSurf|Browser Tab Log|Runway|Cerebras|Crackboard' reference/ai-tools.md`
Expected: each token present.
Run: `rg '\.\./images/image1.png' reference/ai-tools.md`
Expected: 1 match.

---

### Task 5: reference/reading-list.md

**Files:**
- Create: `reference/reading-list.md`
- Sources: `digest.md` (full) + `URGENT.md` learning dumps (`URGENT.md:52-69`, `108-153`) + `mind.md` resource pointers (`mind.md:7` Anna's Archive/FMHY/NPR/Hackaday)

**Transformation:**
- Base is `digest.md` (Books / Research Papers / Articles / Tutorials / Tools & Libraries / Skills to Develop).
- Add `## ML Knowledge Notebooks` from `URGENT.md:52-69` (handsOnMl3, SciML Book, Neural Data Science, Cornell codes, Raschka notebooks, fast.ai, dottxt blog, etc.).
- Add `## Math and Local-LLM Study` from `URGENT.md:108-136` (Tubingen math, ovgu numerics, the full local-LLM run checklist as a nested ordered list) and `## Mechanistic Interpretability Reading` from `URGENT.md:142-152`.
- Add `## Misc Resources` with Anna's Archive, FMHY.net, NPR podcast, Hackaday from `mind.md:7`.

- [ ] **Step 1: Read sources**

Run: `cat digest.md; echo '---'; sed -n '52,69p;108,153p' URGENT.md; echo '---'; sed -n '7p' mind.md`

- [ ] **Step 2: Write reference/reading-list.md** with all sections.

- [ ] **Step 3: Verify**

Run: `rg -c 'Algorithmica|handsOnMl3|Tubingen|CrossCoders|FMHY|Gradient Checkpointing' reference/reading-list.md`
Expected: each token present.

---

### Task 6: reference/courses.md

**Files:**
- Create: `reference/courses.md`
- Source: `oreilly_courses.md`

**Transformation:**
- Convert the numbered list into a table: `| # | Course | Video | GitHub |` with markdown links. Preserve all part1/part2 video links and repo links.
- Drop the trailing empty `23)` entry.

- [ ] **Step 1: Read source**

Run: `cat oreilly_courses.md`

- [ ] **Step 2: Write reference/courses.md** as a table with 22 rows.

- [ ] **Step 3: Verify**

Run: `rg -c 'LangChain Masterclass|Ultimate Go|Learning Apache Tomcat|ML-foundations' reference/courses.md`
Expected: each token present.
Run: `rg -c '^\| 2[0-2] ' reference/courses.md`
Expected: rows 20, 21, 22 present; no row 23.

---

### Task 7: cheatsheets/git.md

**Files:**
- Create: `cheatsheets/git.md`
- Source: `github_learning.md`

**Transformation:**
- Structure into `## SSH Setup`, `## Fixing Contribution Chart`, `## Common Commands` (as a table `| Command | Purpose |`). Keep every command verbatim in fenced code where it is a snippet.

- [ ] **Step 1: Read source**

Run: `cat github_learning.md`

- [ ] **Step 2: Write cheatsheets/git.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'ssh-keygen|git rebase --onto|git bisect|reset-author' cheatsheets/git.md`
Expected: each token present.

---

### Task 8: cheatsheets/neovim.md

**Files:**
- Create: `cheatsheets/neovim.md`
- Source: `neovim_bindings.md`

**Transformation:**
- Convert numbered how-tos into a `| Action | Keys/Command |` table, preserving the exact commenting/uncommenting substitutions (`:norm i#`, `:s/^#\s*//`, etc.) in inline code.

- [ ] **Step 1: Read source**

Run: `cat neovim_bindings.md`

- [ ] **Step 2: Write cheatsheets/neovim.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'norm i#|s/\^#|Visual Mode|AstroNvim' cheatsheets/neovim.md`
Expected: each token present.

---

### Task 9: cheatsheets/linux.md

**Files:**
- Create: `cheatsheets/linux.md`
- Sources: `ubuntu_stuff.md` + `virtual_environment_arch_linx.txt`

**Transformation:**
- Sections: `## Ubuntu` (the `nvidia-settings DigitalVibrance` command) and `## Arch Linux` with subsections `### Python Virtual Environments (miniforge/mamba)`, `### Brightness (ddcutil / Wayland)`, `### Windows 11 VM (GPU passthrough)`. Keep all commands in fenced bash blocks and all tutorial URLs.

- [ ] **Step 1: Read sources**

Run: `cat ubuntu_stuff.md; echo '---'; cat virtual_environment_arch_linx.txt`

- [ ] **Step 2: Write cheatsheets/linux.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'DigitalVibrance|miniforge|ddcutil setvcp|GPU passthrough|OwFZW8x8SsY' cheatsheets/linux.md`
Expected: each token present.

---

### Task 10: action/deadlines.md

**Files:**
- Create: `action/deadlines.md`
- Sources: `deadlines.md` (full) + `preparations.md` (full) + `URGENT.md` dated priorities and events (`URGENT.md:15-24`, `81-86`)

**Transformation:**
- Standardize ALL checkboxes to `- [ ]` / `- [x]` (fix `[ X ]` on `deadlines.md:8`, `= [ ]` on `deadlines.md:15`, `[ x ]` on `deadlines.md:13`).
- Preserve the HTML-commented-out lines (`<!-- ... -->`) as-is (they represent withdrawn/paused items - do not lose them).
- Keep sections: `## Applications`, `## Misc`, `## Opportunities`, `## Conferences`, `## GPU Grants` (from `deadlines.md`), plus `## Programs and Fellowships` (from `preparations.md`, with the "Bottom Line: HEP, Cryo-ET, AI alignment" header and numbered programs + deadlines), plus `## Dated Priorities` and `## Upcoming Events` (from `URGENT.md:15-24,81-86`) with `(done)`/`(elapsed)` tags preserved.

- [ ] **Step 1: Read sources**

Run: `cat deadlines.md; echo '---'; cat preparations.md; echo '---'; sed -n '15,24p;81,86p' URGENT.md`

- [ ] **Step 2: Write action/deadlines.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'CERN OpenLab|ThinkSwiss|LIGO SURF|Pivotal Fellowship|GRAY Scott|JuliaCon2025' action/deadlines.md`
Expected: each token present.
Run: `rg -c '\[ [Xx] \]|= \[' action/deadlines.md`
Expected: 0 (no non-standard checkboxes remain).
Run: `rg -c '<!--' action/deadlines.md`
Expected: >= 5 (commented items preserved).

---

### Task 11: action/tasks.md

**Files:**
- Create: `action/tasks.md`
- Sources: `do_or_dda.md` (full) + `things_to_catch_upon.txt` (full) + `URGENT.md` action items (`URGENT.md:1-13`, `28`, `72-79`) + `strides.txt` actionable items (`strides.txt:2-40` PRs/competitions/applications/hackathons, excluding the toolchain lines handled in Task 3 and the learning topics handled in Task 14)

**Transformation:**
- Sections: `## Active Tasks` (from `do_or_dda.md` + `URGENT.md:1-13`), `## Catch-Up` (from `things_to_catch_upon.txt`, preserving `[ONGOING]`/`[ELAPSED]` -> `(ongoing)`/`(elapsed)`), `## Sharing and Outreach` (from `URGENT.md:28`), `## Venture Ideas` (from `URGENT.md:72-79` - company/website/VTuber ideas), `## Strides` (from `strides.txt` actionable items: SciMLOperators PR, HepMC3 talk, SHREC, MedEye3d vulkan port, hackathons list, fellowships/internships).
- Convert all items to `- [ ]` checklist form (unchecked, since these are open tasks) unless a status tag says done/elapsed.

- [ ] **Step 1: Read sources**

Run: `cat do_or_dda.md; echo '---'; cat things_to_catch_upon.txt; echo '---'; sed -n '1,13p;28p;72,79p' URGENT.md; echo '---'; sed -n '1,40p' strides.txt`

- [ ] **Step 2: Write action/tasks.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'SciMLOperators|EEG|mongodb|cameron Pffiffer|techWithKunal|AMD Developer Challenge|Neuro-Sama' action/tasks.md`
Expected: each token present.

---

### Task 12: action/subscriptions.md

**Files:**
- Create: `action/subscriptions.md`
- Source: `CREDIT_CARD_BILLING.md`

**Transformation:**
- Two tables: `## Credit-Card Subscriptions` (Cursor, Modal Labs, HuggingFace with the card owner `(hurtreallybadly)` / `(divital)` labels) and `## Credit-Card-Less Subscriptions` (Tinker $150, OpenAI $25, Blaxel $250, Google AI Pro w/ expiry Aug-2026). Keep the "BHAVYA INDIAN OVERSEAS BANK CREDIT CARD" note.

- [ ] **Step 1: Read source**

Run: `cat CREDIT_CARD_BILLING.md`

- [ ] **Step 2: Write action/subscriptions.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'INDIAN OVERSEAS|Tinker|Blaxel|August-2026|Modal Labs' action/subscriptions.md`
Expected: each token present.

---

### Task 13: ideas/projects.md

**Files:**
- Create: `ideas/projects.md`
- Sources: `anticipated_projects.md` (full) + `URGENT.md` project concepts (`URGENT.md:30-50` Cryo-ET competition + TomoTwin/DeepFinder/nnU-Net/MONAI onboarding + Neurotorium/Northeastern/ML4Sci/Grand Challenge project ideas)

**Transformation:**
- Keep all `anticipated_projects.md` sections (High Priority Tasks, Project Ideas table, Medical Imaging Research A-D with resources, Upcoming Opportunities, Project Concepts, Interesting References).
- Add `## Cryo-ET and Imaging Projects` from `URGENT.md:30-50` with the onboarding concepts as a labeled link list (TomoTwin, DeepFinder, nnU-Net, MONAI with their URLs) and the project-idea bullets (Neurotorium-like brain atlas viewer, Northeastern/Jakub Mitura, ML4Sci, Grand Challenge, A Star SIPGA, Neuro-Sama).

- [ ] **Step 1: Read sources**

Run: `cat anticipated_projects.md; echo '---'; sed -n '30,50p' URGENT.md`

- [ ] **Step 2: Write ideas/projects.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'Sound of Sorting|Radiomic|Capsule Network|TomoTwin|deepfinder|Neurotorium' ideas/projects.md`
Expected: each token present.

---

### Task 14: ideas/research-interests.md

**Files:**
- Create: `ideas/research-interests.md`
- Sources: `concepts.txt` (full) + `comp_bio.md` (full) + `strides.txt` learning topics (`strides.txt:29-34`) + `mind.md` field interests (`mind.md:9-12`) + `URGENT.md:101` languages-as-skills

**Transformation:**
- Sections: `## Computational Interests` (from `concepts.txt`, preserving the chatbots->reasoning->agents->orgs->AGI ladder and the Apple iCloud note reference), `## Computational Biology and Neuroscience` (from `comp_bio.md` - all links, the "interests" list, the resource dump; preserve `[GRIND THIS REPOSITORY]` emphasis as bold), `## Learning Tracks` (from `strides.txt:29-34`: SciML, Bayesian/probabilistic, QML, Graph NN, PINNs, mechanistic modelling), `## Fields of Interest` (from `mind.md:9-12`), `## Languages to Master` (from `URGENT.md:101`).

- [ ] **Step 1: Read sources**

Run: `cat concepts.txt; echo '---'; cat comp_bio.md; echo '---'; sed -n '29,34p' strides.txt; echo '---'; sed -n '9,12p' mind.md; echo '---'; sed -n '101p' URGENT.md`

- [ ] **Step 2: Write ideas/research-interests.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'Cache Replacement|NeuroAnalyzer|Active Inference|PINNs|Olfactory|reservoir|Free Energy Principle' ideas/research-interests.md`
Expected: each token present.

---

### Task 15: ideas/vision.md

**Files:**
- Create: `ideas/vision.md`
- Source: `mind.md` aspirational parts (`mind.md:11,13-25` - shaders/Mike Klubnika, Dyson design institute, aesthetic house, reverse engineering / market saturation / agent management / research skills, entrepreneurship, kids/foundations Masa-son/RBC Borealis, university-lab pursuits, target countries)

**Transformation:**
- Sections: `## Craft` (shaders, Dyson design), `## Lifestyle` (aesthetic house), `## Skills to Cultivate` (reverse engineering, market saturation, agent management, research skills), `## Entrepreneurship`, `## Long-Term` (kids/foundations, target countries US/China/Russia/Japan/Canada/South-Korea).
- Note: `mind.md:9-12` field interests go to Task 14; `mind.md:1-6` people go to Task 16; `mind.md:7` resources go to Task 5. This task takes only the aspirational remainder.

- [ ] **Step 1: Read source**

Run: `cat mind.md`

- [ ] **Step 2: Write ideas/vision.md** (aspirational lines only).

- [ ] **Step 3: Verify**

Run: `rg -c 'Mike Klubnika|Dyson|Masa-son|RBC Borealis|South-Korea|Market Saturation' ideas/vision.md`
Expected: each token present.

---

### Task 16: network/people.md

**Files:**
- Create: `network/people.md`
- Sources: `people.txt` (full) + `mind.md` names (`mind.md:1-5`: Rukai Peng, Koki Mashita, Joe Nagai, Eurisko Fella, Barbie)

**Transformation:**
- Table `| Person | Note | Link |` for those with links; keep the "MISC" and "Inspirations" groupings as subsections. Add the 5 `mind.md` names under a `## Contacts` subsection (Rukai Peng = Bilibili, Barbie = aerospace physics discord, etc.).

- [ ] **Step 1: Read sources**

Run: `cat people.txt; echo '---'; sed -n '1,5p' mind.md`

- [ ] **Step 2: Write network/people.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'Justine Tunney|CoCoCry|Cameron Pfiffer|Rukai Peng|IronMouse|Lucy Guo' network/people.md`
Expected: each token present.

---

### Task 17: network/companies.md

**Files:**
- Create: `network/companies.md`
- Source: `dream_companies.txt`

**Transformation:**
- Sections: `## Software Companies` (the main list), `## Currently Pursuing` (the "Currently" block with ambassador/hackathon/applied items), `## Other Companies`. Keep the inline commentary lines (e.g. "these companies freaking exist today") as plain notes.

- [ ] **Step 1: Read source**

Run: `cat dream_companies.txt`

- [ ] **Step 2: Write network/companies.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'Chan Zuckerberg|Northwood space|Meshery|Helaina|NousResearch|Golden Gate Sotheby' network/companies.md`
Expected: each token present.

---

### Task 18: network/job-descriptions.md

**Files:**
- Create: `network/job-descriptions.md`
- Source: `job_desc.md`

**Transformation:**
- One `##` section per role (Vector Institute, Kodiak, Xpent Motors), each with the full description in a blockquote or fenced block so bullet lists survive. Keep the top `Platforms:` and `Langs:` reference lines as a short `## Search Reference` intro.

- [ ] **Step 1: Read source**

Run: `cat job_desc.md`

- [ ] **Step 2: Write network/job-descriptions.md**

- [ ] **Step 3: Verify**

Run: `rg -c 'Vector Institute|Kodiak|Xpent|SLURM|open vocabulary detection' network/job-descriptions.md`
Expected: each token present.

---

### Task 19: README.md hub

**Files:**
- Modify: `README.md`

**Transformation:**
- Keep a short intro (evolve the existing one-liner).
- Add a `## Quick Jump` list linking the 3 most-used files: `action/deadlines.md`, `action/tasks.md`, `reference/social-hub.md`.
- Add a `## Contents` section with a subsection per folder, each listing its files as relative markdown links with a one-line description. Example row: `- [social-hub.md](reference/social-hub.md) - social handles, communities, job boards, resource directories`.

- [ ] **Step 1: Write README.md** with intro + Quick Jump + Contents (all 17 files linked with descriptions).

- [ ] **Step 2: Verify all links resolve**

Run: `rg -o '\]\(([a-z]+/[a-z-]+\.md)\)' -r '$1' README.md | while read f; do test -f "$f" || echo "MISSING: $f"; done`
Expected: no MISSING output (every linked file exists).

---

### Task 20: Verify no information lost, then delete sources

**Files:**
- Delete (after verification): `main.md`, `tools.md`, `ai_sorcery.md`, `digest.md`, `oreilly_courses.md`, `github_learning.md`, `neovim_bindings.md`, `ubuntu_stuff.md`, `virtual_environment_arch_linx.txt`, `deadlines.md`, `preparations.md`, `do_or_dda.md`, `things_to_catch_upon.txt`, `URGENT.md`, `strides.txt`, `CREDIT_CARD_BILLING.md`, `anticipated_projects.md`, `concepts.txt`, `comp_bio.md`, `mind.md`, `people.txt`, `dream_companies.txt`, `job_desc.md`

**Transformation:** Global token-survival check. For each source, extract distinctive tokens (URLs, program names, handles) and confirm each appears somewhere in the new tree (`reference/ cheatsheets/ action/ ideas/ network/ README.md`). Only delete a source once its tokens are confirmed.

- [ ] **Step 1: Global grep survival check**

Run a spot-check across the new tree for a broad token set spanning all sources:
```bash
cd /Users/dorachan/Desktop/social_presence
NEW="reference cheatsheets action ideas network README.md"
for t in "hurtbadly2" "Numaprof" "Browser Tab Log" "Algorithmica" "Ultimate Go" "ssh-keygen" "norm i#" "DigitalVibrance" "CERN OpenLab" "SciMLOperators" "INDIAN OVERSEAS" "Radiomic" "Cache Replacement" "NeuroAnalyzer" "Mike Klubnika" "Justine Tunney" "Northwood space" "Kodiak" "TomoTwin" "handsOnMl3" "Pivotal Fellowship" "Neuro-Sama"; do
  c=$(rg -F -c "$t" $NEW 2>/dev/null | wc -l); [ "$c" -eq 0 ] && echo "LOST: $t";
done; echo "check complete"
```
Expected: `check complete` with no `LOST:` lines.

- [ ] **Step 2: Manual diff of any thin/merged source**

For each merged/split source, eyeball that its unique lines landed:
Run: `for f in URGENT.md mind.md strides.txt comp_bio.md; do echo "=== $f ==="; cat "$f"; done`
Confirm visually against the new files. Fix any gap before deleting.

- [ ] **Step 3: Delete sources**

```bash
cd /Users/dorachan/Desktop/social_presence
rm main.md tools.md ai_sorcery.md digest.md oreilly_courses.md \
   github_learning.md neovim_bindings.md ubuntu_stuff.md virtual_environment_arch_linx.txt \
   deadlines.md preparations.md do_or_dda.md things_to_catch_upon.txt URGENT.md strides.txt \
   CREDIT_CARD_BILLING.md anticipated_projects.md concepts.txt comp_bio.md mind.md \
   people.txt dream_companies.txt job_desc.md
```

- [ ] **Step 4: Confirm final tree and untouched app**

Run: `git status --short`
Expected: only note files (added under the 5 folders + README + docs/), and the 23 deletions. No changes to `frontend/`, `backend/`, `render.yaml`, `images/`, or config files.
Run: `ls reference cheatsheets action ideas network`
Expected: 17 `.md` files total across the folders.

---

## Notes on the two remaining root files

- `README.md` is rewritten as the hub (Task 19).
- Cruft not part of the knowledge base and left untouched: `.main.txt.un~`, `main.txt~` (Vim swap/backup artifacts), `Grafana`, `servers` (56-byte stubs), `hackathons.xlsx`. If the user wants these cleaned, that is a separate follow-up.
