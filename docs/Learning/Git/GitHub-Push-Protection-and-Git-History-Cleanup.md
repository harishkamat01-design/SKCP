# GitHub Push Protection & Git History Cleanup
Version: 1.0
Date: 23 July 2026
Project: SKCP – Shree Kundodari Cement Products


# Objective
This document explains how a GitHub Push Protection error occurred due to accidentally committing API keys, how Git history works, and the complete recovery process followed to safely clean the repository history.


# Background
During the completion of Module 1 – Business Analysis, several API keys were accidentally pasted into the .gitignore file for temporary reference.
The keys included:
- Atlassian API Token
- Groq API Key
- OpenRouter API Key
- CommandCode Key

Although these keys were later removed from .gitignore, GitHub continued rejecting the push.


# Why GitHub Still Blocked the Push
Many beginners assume that deleting secrets from the latest version of a file is enough.
This is incorrect.
GitHub Push Protection scans every commit being pushed.
If a secret exists in any commit in the branch history, the push is rejected.
In our case:
Commit A
↓

Commit B  ← API Keys added

↓

Commit C  ← API Keys removed

↓

Commit D

Even though Commit C removed the secrets, Commit B still contained them.
GitHub detected the secrets in Commit B and rejected the push.


# Initial Push Error
GitHub returned:

GH013: Repository rule violations found

Push cannot contain secrets

- Detected secrets:
- Atlassian API Token
- Groq API Key
- OpenRouter API Key


# Investigation Process
First, verify the current files.
- git grep -n "gsk"
- git grep -n "sk-or-v1"
- git grep -n "ATATT"

Result:

No output.

Current files contained no secrets.
---
Next, inspect the suspicious commit.
 - git show de41ed3 -- .gitignore

Output showed:
- JIRA API Token
- Groq API Key
- OpenRouter API Key
- Command Code key

This confirmed that secrets still existed in commit history.
---
# First Attempt – Interactive Rebase
First, verify the current files.

- git grep -n "gsk"
- git grep -n "sk-or-v1"
- git grep -n "ATATT"

Result:

No output.

Current files contained no secrets.
---

Next, inspect the suspicious commit.

git show de41ed3 -- .gitignore

Output showed:
- JIRA API Token
- Groq API Key
- OpenRouter API Key
- Command Code key

This confirmed that secrets still existed in commit history.
---
# First Attempt – Interactive Rebase
git rebase -i HEAD~3

During rebase:
- Merge conflicts occurred
-  .gitignore conflicted
-  VS Code closed unexpectedly
- Rebase became interrupted

Git entered:
main | REBASE

Multiple conflicts had to be resolved manually.

Eventually the rebase became unnecessarily complicated.
---
# Decision
Since the commits had never reached GitHub, rewriting the local history completely was simpler and safer.
We abandoned the rebase approach.
---
# Final Solution
## Step 1
Create a backup branch.  
- git branch backup-secret-fix

## Step 2
Return to the last clean GitHub commit.
- git reset --soft 7a3e5a6

This preserved:
- all files
- all changes
- staging area
Only the commit history was removed.

## Step 3
Verify status.
- git status
Everything remained staged.
---
## Step 4
Create one clean commit.
- git commit -m "Complete Module 1: Business Analysis and project documentation"

New history:

222c3fb
↓

7a3e5a6

↓

older commits...

The bad commits disappeared.

---
## Step 5
Verify no secrets exist.
- git grep -n "gsk"
- git grep -n "sk-or-v1"
- git grep -n "ATATT"

Result:
No output.
---
## Step 6
Verify commit history.
- git log --oneline

Output:
- 222c3fb
- 7a3e5a6
- 9f45441
...

The commits containing secrets no longer existed.

---
## Step 7
Push safely.

- git push --force-with-lease origin main

Push completed successfully.

---
## Why Force-With-Lease?
Since commit history changed locally, GitHub required a history rewrite.
Instead of:
- git push --force
We used:
- git push --force-with-lease

Advantages:
- Prevents accidentally overwriting others' work.
- Safer than --force.
- Recommended by Git documentation.
.
---

# Commands Used

## Inspect repository
- git status
- git log --oneline
- git log --oneline --graph
.
---
## Search for secrets
- git grep -n "gsk"
- git grep -n "ATATT"
- git grep -n "sk-or-v1"
.
---
## Inspect specific commit
- git show de41ed3 -- .gitignore
.
---

## Backup
- git branch backup-secret-fix
.
---
## Reset history
- git reset --soft 7a3e5a6
.
---
## Commit again
- git commit -m "Complete Module 1: Business Analysis and project documentation"
.
---
## Push
- git push --force-with-lease origin main
.
---
# Lessons Learned
1. Git tracks history, not only files.
Deleting sensitive data from the latest version does not remove it from previous commits.
2. GitHub Push Protection scans all commits.
Every commit being pushed is inspected for exposed secrets.
3. .gitignore does not remove tracked files.
It only prevents new untracked files from being added.
4. git grep searches the current working tree only.
It cannot detect secrets hidden inside old commits.
5. git show <commit> is useful for investigating history.
It allows inspection of a specific commit without changing the working directory.
6. git reset --soft preserves work.
It removes commits while keeping all file changes staged.
7. Use --force-with-lease instead of --force.
It is the safer option when rewriting history.
8. Rotate exposed secrets.
If an API key has ever been committed, even briefly, treat it as compromised. Revoke the old key and generate a new one.
---
# Best Practices
1. Never store API keys in project files.
2. Use environment variables (.env) for secrets.
3. Ensure .env is listed in .gitignore.
4. Review git diff before committing.
5. Run git grep for known secret patterns if unsure.
6. Keep commits focused and small.
7. Create backup branches before rewriting history.
8. Use git push --force-with-lease only when history has been intentionally rewritten.
.
---
# Final Outcome
| Item | Status |
|------|--------|
| Secrets removed from current files | ✅ |
| Secrets removed from Git history | ✅ |
| GitHub Push Protection passed | ✅ |
| Repository synchronized with GitHub | ✅ |
| Module 1 documentation published | ✅ |
| Repository history cleaned | ✅ |


# Conclusion
This exercise demonstrated a real-world Git incident involving accidental secret exposure. By investigating the commit history, understanding how GitHub Push Protection works, and rewriting local history safely, the repository was restored to a clean and secure state.

The project successfully retained all documentation and development work while ensuring that sensitive information was completely removed from the branch history before publishing to GitHub.




