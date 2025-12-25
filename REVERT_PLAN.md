# Revert Plan & Git Recovery Guide

This document outlines how to manage the checkpoint created today and how to revert changes if needed.

## Current State
- **Current Branch:** `main`
- **Checkpoint Branch:** `backup/ui-improvements-checkpoint`
- **Commit Message:** "Checkpoint: Enhanced UI with dark mode support and premium styling"

---

## Scenario A: I want to go back to exactly this saved point
If you make further changes that break the app and want to reset to *this* checkpoint:

```bash
# Hard reset the current branch to the backup checkpont
git reset --hard backup/ui-improvements-checkpoint
```

## Scenario B: I want to UNDO everything we just did (Go back to before today's work)
If you decide you don't like the new UI/Dark mode and want to go back to the previous state:

1. **Find the previous commit hash:**
   ```bash
   git log --oneline
   ```
   *Look for the commit BEFORE "Checkpoint: Enhanced UI..."*

2. **Reset to that commit:**
   ```bash
   # Replace <commit-hash> with the actual code (e.g., a1b2c3d)
   git reset --hard <commit-hash>
   ```

## Scenario C: I just want to undo the very last "Save" (Commit)
If you made a commit and want to undo it but keep your file changes (so you can edit them):
```bash
git reset --soft HEAD~1
```

If you want to undo it and THROW AWAY the file changes:
```bash
git reset --hard HEAD~1
```

## Scenario D: Emergency! I lost everything!
If you accidentally deleted a branch or reset too far, Git keeps a history of *every* action for a while.

1. **View the reference log:**
   ```bash
   git reflog
   ```
   *You will see a list like `HEAD@{0}: commit: ...`, `HEAD@{1}: checkout: ...`*

2. **Restore to a specific point in time:**
   ```bash
   # Example: git reset --hard HEAD@{5}
   git reset --hard <reflog-index>
   ```

---
**Tip:** Always verify your status with `git status` before running destructive commands like `git reset --hard`.
