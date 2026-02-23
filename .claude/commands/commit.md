---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
description: Review staged changes and create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit following these steps:

1. Analyze all staged changes (both previously staged and newly added) and draft a commit message
2. Check for any sensitive information that shouldn't be committed
3. Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"
4. Follow the repository's commit message style based on recent commits
5. Create the commit
6. Run git status to confirm the commit succeeded

IMPORTANT:

- DO NOT add `Generated with Claude Code` to the end of the commit message
- ONLY consider currently staged changes
- DO NOT push the commit to remote
- DO NOT update git config
- If the commit fails due to pre-commit hooks, retry ONCE to include automated changes
