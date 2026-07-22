# Learning Summary

Date: 21 July 2026

---

# Git Learning - Day 1

## 1. What is .gitignore?

The `.gitignore` file tells Git which files and folders should NOT be tracked or committed to the repository.

Examples include:

- node_modules/
- .env
- build/
- dist/
- coverage/

Reason:
These files are either automatically generated, contain sensitive information, or can be recreated at any time.

---

## 2. Why should node_modules never be committed?

The `node_modules` folder contains all installed project dependencies.

Reasons for excluding it:

- It can be recreated using `npm install`
- It significantly increases repository size
- It slows down cloning and pushing
- Different operating systems may generate different files

Instead, Git only stores:

- package.json
- package-lock.json

These files contain all dependency information required to rebuild the project.

---

## 3. Difference between package.json and package-lock.json

### package.json

Contains:

- Project information
- Scripts
- Dependency names
- Version ranges

Example:

React: ^19.1.0

---

### package-lock.json

Contains:

- Exact package versions
- Dependency tree
- Integrity hashes

Purpose:

Ensures every developer installs the exact same dependency versions.

Both files should always be committed to Git.

---

## 4. Why did Git track node_modules?

Git started tracking the folder before `.gitignore` was properly configured.

Important lesson:

Adding a folder to `.gitignore` does NOT automatically remove it from Git tracking.

---

## 5. How to stop tracking a folder without deleting it?

Command:

git rm -r --cached node_modules

Meaning:

- Removes the folder from Git's tracking index.
- Does NOT delete the folder from the local machine.
- Allows `.gitignore` to work correctly.

---

## 6. Git Staging Area

Git has three important states:

Working Directory
↓
Staging Area
↓
Repository (Commit)

Commands:

git add
Moves files from Working Directory to Staging Area.

git commit
Moves files from Staging Area into the Git Repository.

---

## 7. Understanding git status

The `git status` command shows:

- Current branch
- Staged files
- Modified files
- Deleted files
- Untracked files

This should be checked before every commit.

---

## 8. Common Git Workflow

Professional workflow:

git status
git add -A
git status
git commit -m "meaningful message"
git push

Never skip checking `git status`.

---

## 9. Conventional Commit Messages

Instead of writing:

commit changes

Use meaningful commit types.

Examples:

feat:
New feature

fix:
Bug fix

docs:
Documentation

refactor:
Code improvements

test:
Testing

build:
Build changes

chore:
Project setup, dependencies, configuration

Example:

chore: initialize SKCP project foundation

---

## 10. Why GitHub repositories should remain clean

A professional repository should contain only:

Source code
Documentation
Configuration files
Project assets

It should NOT contain:

node_modules
Temporary files
Build folders
Environment variables
IDE-generated files

---

## 11. Important Git Lesson Learned
Always create `.gitignore` BEFORE running:

npm install

This prevents Git from tracking unnecessary files.


## 12. Project Information

Project Name:
SKCP (Shree Kundodari Cement Products)

GitHub Repository:
https://github.com/harishkamat01-design/SKCP

Current Module:
Module 0 – Environment Setup

Status:
Completed ✅

## 13. Key Takeaways

✓ Always verify `git status` before committing.

✓ Never commit `node_modules`.

✓ Commit both `package.json` and `package-lock.json`.

✓ Use meaningful commit messages.

✓ Keep the repository clean and organized.

✓ Understand every command before executing it.

---

Today's Achievement

Successfully initialized the SKCP Git repository using professional Git practices and understood the importance of repository hygiene.

## 14. Git history clean and meaningful.
chore: initialize SKCP project foundation
docs: add MIT license
docs: create software blueprint
feat: initialize React frontend
feat: add dashboard layout
feat: connect frontend to FastAPI


