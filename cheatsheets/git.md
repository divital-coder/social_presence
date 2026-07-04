# Git Cheatsheet

## Table of Contents

- [SSH Setup](#ssh-setup)
- [Fixing the Contribution Chart](#fixing-the-contribution-chart)
- [Common Commands](#common-commands)

---

## SSH Setup

GitHub removed authentication support over https/http protocols, so use SSH instead.

1. Generate an SSH key for your device:

```bash
ssh-keygen -t rsa -b 4096 -C "divital2004@gmail.com"
```

2. Add the generated `.pub` key file to your GitHub settings page and authenticate.
3. Clone with the SSH remote instead of https:

```bash
git clone git@github.com:divital-coder/repo_name.git
```

4. Then work as usual:

```bash
git add .                    # stage changes
git commit -m "text"
git push origin <branchname>
```

---

## Fixing the Contribution Chart

If the contribution chart is not updating after recent commits:

```bash
git config --global user.name "divital-coder"
git config --global user.email divital2004@gmail.com
git commit --amend --reset-author
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `git log` | Show commit history |
| `git status` | Show working tree status |
| `git add .` | Stage all changes |
| `git add path` | Stage a specific path |
| `git commit -m "Short desc"` | Commit staged changes |
| `git commit -am "Short desc"` | Stage tracked + commit |
| `git commit -a --amend` | Amend the last commit |
| `git push` | Push to upstream |
| `git push -u origin divital-coder/branch-name` | Push and set upstream |
| `git switch branch-name` | Switch branch |
| `git switch -c divital-coder/branch-name` | Create and switch branch |
| `git branch -D divital-coder/branch-name` | Force-delete branch |
| `git pull --ff-only origin <current_branch>` | Fast-forward pull |
| `git fetch origin main` | Fetch main |
| `git reset --hard origin/main` | Reset to remote main |
| `git checkout -- .` | Discard working changes |
| `git rebase origin/main` | Rebase onto main |
| `git rebase -i HEAD~<N>` | Interactive rebase |
| `git rebase --onto` | Rebase onto a new base |
| `git cherry-pick <hash>` | Apply a specific commit |
| `git stash` | Stash changes |
| `git stash pop` | Restore stashed changes |
| `git stash list` | List stashes |
| `git remote add upstream <url>` | Add upstream remote |
| `git bisect` | Binary-search for a bad commit |
| `git reflog` | Show reference log |
