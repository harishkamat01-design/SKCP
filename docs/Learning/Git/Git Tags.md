# Git Learning #1 — Git Tags

## Purpose

A Git Tag is a permanent label attached to a specific commit.

Unlike branches, tags do not move.

They are used to mark important milestones such as:

- Module Completion
- Releases
- Production Versions
- Stable Checkpoints

---

## Create Tag

```bash
git tag v0.4.0-customer-module
```

---

## Push Tag

```bash
git push origin v0.4.0-customer-module
```

---

## View Tags

```bash
git tag
```

---

## Delete Local Tag

```bash
git tag -d v0.4.0-customer-module
```

---

## Delete Remote Tag

```bash
git push origin --delete v0.4.0-customer-module
```

---

## Philosophy

Commits tell the story of development.

Tags identify important milestones in that story.