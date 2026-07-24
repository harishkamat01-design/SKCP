# SKCP Architecture Decision Log (ADR)

**Project:** SKCP (Shree Kundodari Cement Products)  
**Version:** 1.0  
**Status:** Active  
**Author:** Harish Kamat  
**Reviewer:** Architect  
**Created:** 2026-07-21  
**Last Updated:** 2026-07-23

---

# Purpose

This document records all major architectural and engineering decisions made during the development of SKCP.

Each Architecture Decision Record (ADR) captures:

- Context
- Decision
- Reason
- Expected Impact

This document serves as a permanent technical reference for the project.

---

# ADR-001 : SKCP will be developed as a Business Operating System (BOS)

## Date
2026-07-21

## Status
Accepted

## Context

The existing business relies entirely on manual notebooks for production, sales, inventory and payment tracking.

## Decision

SKCP will be designed as a Business Operating System (BOS) that digitizes and integrates all major business operations into one application.

## Reason

A single system provides:

- Centralized data
- Better reporting
- Easier maintenance
- Future AI integration

---

# ADR-002 : PostgreSQL will be the Primary Database

## Date
2026-07-21

## Status
Accepted

## Context

The application requires reliable storage for customers, products, inventory, sales and payments.

## Decision

PostgreSQL will be the single source of truth for all operational data.

## Reason

- Free
- Open Source
- Reliable
- ACID compliant
- Excellent Spring Boot support
- Easily scalable

---

# ADR-003 : Inventory will be System Managed

## Date
2026-07-21

## Status
Accepted

## Context

Inventory currently changes manually.

## Decision

Inventory will automatically:

- Increase through Production
- Decrease through Sales

## Reason

This eliminates manual stock calculations and ensures accurate inventory.

---

# ADR-004 : Pricing will be Calculated by the System

## Date
2026-07-21

## Status
Accepted

## Context

Manual calculations increase the chance of pricing errors.

## Decision

The application will calculate the sale amount automatically.

```
Final Amount =
(Product Price × Quantity)
− Discount
+ Transport Charges
```

## Reason

Improves consistency and reduces calculation mistakes.

---

# ADR-005 : One Sale can contain Multiple Products

## Date
2026-07-21

## Status
Accepted

## Context

Customers often purchase multiple block sizes in one order.

## Decision

One Sale record may contain multiple Product items.

## Reason

Supports real business operations while maintaining normalized database design.

---

# ADR-006 : Payments will be tracked independently from Sales

## Date
2026-07-21

## Status
Accepted

## Context

Customers may pay immediately or in multiple installments.

## Decision

Payments will reference Sales rather than replacing them.

## Reason

This enables:

- Pending Balance
- Payment History
- Installment Tracking

---

# ADR-007 : Standard Documentation Structure

## Date
2026-07-22

## Status
Accepted

## Context

Project documentation should remain consistent throughout development.

## Decision

Major documentation will follow this structure:

- Purpose
- Description
- Current Process
- Future Process
- Notes

## Reason

Improves readability and long-term maintainability.

---

# ADR-008 : Standard Project Completion Workflow

## Date
2026-07-23

## Status
Accepted

## Context

Every completed module should leave the repository in a professional state.

## Decision

Each completed module must update:

- README.md
- CHANGELOG.md
- Daily Journal
- Milestones
- GitHub Repository

## Reason

Ensures documentation always reflects the latest project status.

---

# ADR-009 : Maintain a Software Engineering Glossary

## Date
2026-07-23

## Status
Accepted

## Context

Many software engineering concepts will be introduced throughout the project.

## Decision

Maintain a living Software Engineering Glossary.

## Reason

Provides a centralized reference for terminology and improves long-term learning.

---

# ADR-010 : Standardize Git Line Endings

## Date
2026-07-23

## Status
Accepted

## Context

Development is performed on Windows while future contributors may use Linux or macOS.

## Decision

Introduce a `.gitattributes` file to normalize line endings.

## Reason

- Prevent unnecessary Git diffs
- Maintain repository consistency
- Improve cross-platform compatibility

---

# Decision Status Legend

| Status | Meaning |
|---------|---------|
| Accepted | Official project decision |
| Proposed | Under discussion |
| Deprecated | No longer used |
| Superseded | Replaced by another ADR |

---

**End of Architecture Decision Log**