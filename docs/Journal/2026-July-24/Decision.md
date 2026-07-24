# Decision Log

**Date:** 2026-07-24

---

# Decision 1

## Title

Business-First Architecture

### Decision

The SKCP system architecture will always be designed based on the real business workflow before considering UI, database, or implementation.

### Reason

Understanding the business first leads to simpler, more maintainable software.

---

# Decision 2

## Title

Three Core Business Domains

### Decision

The complete business will be organized into three primary domains:

- Raw Materials
- Production
- Sales

All future modules, entities, and features should belong to one of these domains.

### Reason

These three domains accurately represent the real factory operations.

---

# Decision 3

## Title

Preserve Founder Knowledge

### Decision

SKCP should capture and preserve the founder's years of business experience instead of relying only on manual knowledge.

### Reason

Business knowledge is an organizational asset and should become part of the software.

---

# Decision 4

## Title

Decision Support Vision

### Decision

SKCP should evolve beyond being a record-keeping application.

Long-term vision:

Information

↓

Reports

↓

Insights

↓

Recommendations

↓

Business Decisions

### Reason

The system should actively help improve business decisions.

---

# Decision 5

## Title

Documentation Philosophy

### Decision

Documentation will be completed during End Of Day (EOD) instead of interrupting the learning flow.

### Reason

Learning should remain natural and uninterrupted while ensuring that all important discoveries are documented before closing the day.

---

# Decision 6

## Title

Lessons Learned Documents

### Decision

Files named `99-*-Lessons-Learned.md` will only be created after substantial knowledge has been accumulated across multiple modules.

### Reason

Lessons Learned should represent earned experience rather than notes from a single day.

---

# Decision 7

## Title

Repository Refactoring

### Decision

Repository cleanup, folder restructuring, README improvements, and documentation consistency will be completed during a dedicated Repository Refactoring Day.

### Reason

Avoid unnecessary interruptions while actively learning and developing.

---

# Decision 8

## Title

Software Engineering Glossary

### Decision

The glossary will be updated only after concepts are fully understood and can be explained with SKCP examples.

### Reason

The glossary should become a practical learning reference rather than a collection of copied definitions.