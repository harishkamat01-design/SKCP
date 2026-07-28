# SKCP Architecture Decision Log (ADR)

**Project:** SKCP (Shree Kundodari Cement Products)  
**Version:** 1.1
**Status:** Active  
**Author:** Harish Kamat  
**Reviewer:** Architect  
**Created:** 2026-07-21  
**Last Updated:** 2026-07-24

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

---

# ADR-011 : Business-First Architecture

## Date
2026-07-24

## Status
Accepted

## Context

During Module 2, it became clear that the factory already follows a well-established business workflow developed through years of practical experience.

## Decision

The software architecture will always be designed around the business workflow rather than forcing the business to adapt to the software.

## Reason

- Preserves existing business practices
- Reduces user resistance
- Ensures the software reflects real factory operations
- Creates a business-driven architecture

---

# ADR-012 : Organize the System into Three Core Business Domains

## Date
2026-07-24

## Status
Accepted

## Context

Business analysis identified that every factory activity naturally belongs to one of three operational areas.

## Decision

The SKCP system will be organized into three primary business domains:

- Raw Materials
- Production
- Sales

## Reason

- Reflects the physical factory layout
- Provides clear module boundaries
- Improves maintainability
- Simplifies future expansion

---

# ADR-013 : Preserve Founder Knowledge

## Date
2026-07-24

## Status
Accepted

## Context

The founder has over twelve years of practical experience in cement block manufacturing and makes many business decisions based on this knowledge.

## Decision

Business knowledge gained through years of practical experience will be documented and gradually incorporated into the software.

## Reason

- Preserves valuable business expertise
- Reduces dependency on a single individual
- Enables future AI-assisted recommendations
- Supports long-term business continuity

---

# ADR-014 : Business Rules and Principles are Permanent

## Date
2026-07-24

## Status
Accepted

## Context

During business analysis, it was observed that while business operations may grow and technology may change, the core business rules and principles remain stable.

## Decision

Business Rules and Business Principles will serve as the permanent foundation for all future software development.

## Reason

- Maintains consistency as the business grows
- Protects business integrity
- Ensures software remains aligned with the organization's vision
- Reduces unnecessary architectural changes

---

# ADR-015 : Information Should Support Business Decisions

## Date
2026-07-24

## Status
Accepted

## Context

The primary objective of SKCP extends beyond storing business data.

The system should assist the owner in making better operational decisions by converting information into actionable insights.

## Decision

SKCP will evolve as a Decision Support System by transforming operational data into meaningful business information and recommendations.

## Reason

- Improves business decision-making
- Enables proactive management
- Forms the foundation for future AI capabilities
- Increases overall business efficiency

---

# ADR-016 : Design the Architecture for Future Business Growth

## Date
2026-07-24

## Status
Accepted

## Context

The current business is expected to expand in the future with additional products, customers, suppliers, machines, labour, and possibly multiple factory locations.

## Decision

The software architecture will be designed to support future business growth without requiring major architectural redesign.

## Reason

- Supports long-term scalability
- Reduces future redevelopment effort
- Protects the initial architectural investment
- Allows the business to expand confidently

---

# Decision Status Legend

| Status | Meaning |
|---------|---------|
| Accepted | Official project decision |
| Proposed | Under discussion |
| Deprecated | No longer used |
| Superseded | Replaced by another ADR |

---

## Summary

As of the completion of Module 2, these Architecture Decision Records establish the permanent architectural foundation of SKCP.

All future decisions related to Database Design, Backend Development, Frontend Development, Deployment, and AI Implementation should remain aligned with these accepted architectural decisions.

The Architecture Decision Records will continue to grow as the project evolves, providing a complete history of the technical and business decisions made throughout the development lifecycle.

---
---

# ADR-017 : Represent Business Events as Transaction Tables

## Date

2026-07-28

## Status

Accepted

## Context

During Module 3 (Database Design), it became evident that the SKCP database should model real business activities instead of merely storing related information.

Business analysis showed that operations such as placing an order, receiving a payment, completing production, and delivering products are independent business events that occur over time.

Representing each event as a separate transaction table creates a database that accurately reflects real factory operations.

## Decision

All transaction tables within SKCP will represent individual business events rather than storing duplicated business information.

Examples include:

- Order
- Order Item
- Payment
- Production
- Delivery

Each transaction will be linked to the appropriate master data using Primary Keys and Foreign Keys.

## Reason

- Represents real business operations accurately
- Preserves complete business history
- Supports proper normalization
- Eliminates duplicate information
- Simplifies future reporting and analytics
- Provides a scalable foundation for Backend APIs and AI-driven business insights

## Impact

Positive:

- Clear business traceability
- Better normalization
- Easier reporting
- Simpler backend API development
- Strong foundation for future ERP capabilities

Consideration:

- Reports require joining multiple transaction and master tables, which is the standard approach in normalized relational database systems.

---

**End of Architecture Decision Log**