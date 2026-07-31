# SKCP Architecture Decision Log (ADR)

**Project:** SKCP (Shree Kundodari Cement Products) 

**Version:** 1.2

**Status:** Active

**Author:** Harish Kamat

**Reviewer:** Architect

**Created On:** 2026-07-21

**Last Updated:** 2026-07-30

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

# ADR-018 : Every Table Must Have a Single Responsibility

## Date

2026-07-30

## Status

Accepted

## Context

During the logical database design, several discussions revealed that combining multiple business concepts into a single table would complicate maintenance and violate normalization principles.

## Decision

Every table shall represent one and only one business responsibility.

Examples:

- Customer stores customer information.
- Payment stores payment information.
- Production stores production information.
- FinishedGoodsStock stores only the current finished goods position.

## Reason

- Simplifies maintenance
- Improves normalization
- Prevents duplicated business logic
- Makes reporting easier

## Impact

Positive:

- Cleaner architecture
- Better scalability
- Easier backend development

---
# ADR-019 : Every Business Attribute Has One Owner

## Date

2026-07-30

## Status

Accepted

## Context

While reviewing all Version 1 tables, it became clear that every business attribute should exist in only one authoritative location.

## Decision

Every business attribute shall have exactly one owning table.

Other tables shall reference that information instead of duplicating it.

Examples:

- Customer Name belongs only to Customer.
- Product Name belongs only to Product.
- Payment Amount belongs only to Payment.

## Reason

- Eliminates duplicate information
- Prevents update anomalies
- Maintains data integrity

## Impact

Positive:

- Consistent data
- Simpler maintenance
- Reliable reporting

---

# ADR-020 : Inventory Will Follow Current Position + Historical Transactions

## Date

2026-07-30

## Status

Accepted

## Context

During inventory modelling, several alternatives were considered for storing stock movement history.

## Decision

Inventory tables shall represent only the current stock position.

Historical movement shall be represented through transaction tables.

Examples:

- Purchase
- Production
- Delivery

Current stock will be maintained in:

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

## Reason

- Faster reporting
- Simpler stock calculations
- Clear separation of responsibilities

## Impact

Positive:

- Better performance
- Easier reconciliation
- ERP-aligned inventory design

---
# ADR-021 : Production Must Record the Asset Used

## Date

2026-07-30

## Status

Accepted

## Context

Although the business currently does not analyse production machine-wise, discussions identified significant future value in knowing which asset produced each production batch.

## Decision

The inventory subsystem shall maintain only the current stock position in dedicated stock tables.

Historical inventory movement shall be preserved through transaction tables.

Current stock tables:

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

Historical movement tables:

- Purchase
- PurchaseItem
- Production
- Delivery
- DeliveryItem

Inventory quantities shall never be manually recalculated from historical transactions during daily operations.

## Reason

This enables future capabilities such as:

- Machine-wise production
- Maintenance planning
- Capacity analysis
- Equipment utilization
- AI-based production insights

while adding almost no complexity to the current workflow.

## Impact

Positive:

- Future-ready architecture
- Better operational analytics
- Improved maintenance support

---
# ADR-022 : Business Domains Shall Organize the Entire ERP

## Date

2026-07-30

## Status

Accepted

## Context

As the database matured, organizing tables purely by technical categories became less meaningful than grouping them according to business responsibilities.

## Decision

The SKCP ERP shall be organized into six business domains:

- Master Data
- Procurement
- Production
- Inventory
- Sales
- Finance

All future modules shall follow this domain structure.

## Reason

- Mirrors the real business
- Improves modularity
- Simplifies navigation
- Supports future expansion

## Impact

Positive:

- Cleaner architecture
- Better documentation
- Easier onboarding
- Clear module ownership

---

# ADR-023 : Version 1 Will Prefer Simplicity Over Premature Complexity

## Date

2026-07-30

## Status

Accepted

## Context

Several advanced features were identified during Module 3, including:

- Batch traceability
- Reserved stock
- Delivery confirmation
- Damage tracking
- Machine utilization analytics

These features were valuable but not immediately required.

## Decision

Version 1 shall implement only the functionality required for today's business while designing clean extension points for future versions.

## Reason

- Faster delivery
- Lower complexity
- Easier adoption
- Better maintainability

## Impact

Positive:

- Stable Version 1
- Controlled project scope
- Clear future roadmap
---

## Current Status

As of **30 July 2026**, the Architecture Decision Log contains **23 accepted Architecture Decision Records (ADRs)** covering:

- Business Architecture
- Software Architecture
- Database Architecture
- Inventory Philosophy
- Normalization Principles
- Business Domains
- Future Scalability

These ADRs collectively form the architectural foundation of the SKCP ERP and shall guide all future development activities.

---

## Current Status

As of **30 July 2026**, the Architecture Decision Log contains **23 accepted Architecture Decision Records (ADRs)** covering:

- Business Architecture
- Software Architecture
- Database Architecture
- Inventory Philosophy
- Normalization Principles
- Business Domains
- Future Scalability

These ADRs collectively form the architectural foundation of the SKCP ERP and shall guide all future development activities.

---

# ADR-024 : Header–Detail Pattern Shall Be Used for Business Transactions

## Date

2026-07-31

## Status

Accepted

## Context

Business transactions such as Purchases, Orders, Deliveries and Payments naturally contain multiple line items.

## Decision

SKCP shall use the Header–Detail pattern for all major transaction modules.

Examples:

Purchase → PurchaseItem

Order → OrderItem

Delivery → DeliveryItem

Payment → PaymentAllocation

## Reason

- Eliminates duplicated information
- Supports multi-item transactions
- Simplifies reporting
- Matches ERP industry standards

## Impact

Positive

- Better normalization
- Flexible transactions
- Easier backend implementation

---
# ADR-025 : Payment Allocation Shall Resolve Many-to-Many Relationships

## Date

2026-07-31

## Status

Accepted

## Context

Customers may pay one order through multiple payments, or one payment may settle multiple orders.

## Decision

PaymentAllocation shall act as the bridge table between Payment and Order.

## Reason

Supports:

- Partial Payments
- Installment Payments
- One payment across multiple orders

## Impact

Positive

- Flexible finance module
- Accurate outstanding balance
- Complete payment history
---
# ADR-026 : Current Stock Shall Not Store Historical Transactions

## Date

2026-07-31

## Status

Accepted

## Context

Inventory queries are frequent while historical transaction reports are occasional.

## Decision

Current stock tables shall only store the latest inventory position.

Historical movement remains in transaction tables.

## Reason

Improves:

- Performance
- Simplicity
- Inventory lookup

## Impact

Positive

Real-time inventory becomes extremely fast.
---
# ADR-026 : Current Stock Shall Not Store Historical Transactions

## Date

2026-07-31

## Status

Accepted

## Context

Inventory queries are frequent while historical transaction reports are occasional.

## Decision

Current stock tables shall only store the latest inventory position.

Historical movement remains in transaction tables.

## Reason

Improves:

- Performance
- Simplicity
- Inventory lookup

## Impact

Positive

Real-time inventory becomes extremely fast.
---
# ADR-027 : Curing Shall Be Modeled as an Independent Inventory Stage

## Date

2026-07-31

## Status

Accepted

## Context

Manufactured blocks remain unavailable for sale until curing is complete.

## Decision

A dedicated CuringStock table shall represent products under curing.

FinishedGoodsStock shall only contain saleable inventory.

## Reason

Represents the real manufacturing lifecycle.

## Impact

Positive

Supports:

- Production tracking
- Inventory accuracy
- Future batch traceability
---
# ADR-028 : Database Shall Be Organized Around Business Domains

## Date

2026-07-31

## Status

Accepted

## Context

The finalized database consists of multiple functional areas.

## Decision

All tables shall belong to one business domain.

Domains:

- Master Data
- Procurement
- Production
- Inventory
- Sales
- Finance

## Reason

Improves modularity and documentation.

## Impact

Positive

Better scalability and maintainability.
---
# ADR-029 : Business Terminology Shall Be Used Across Every Layer

## Date

2026-07-31

## Status

Accepted

## Context

Inconsistent terminology increases confusion between database, backend and frontend.

## Decision

Database, Backend, APIs, Frontend and Documentation shall use identical business terminology.

Example:

Customer

↓

Customer Entity

↓

Customer API

↓

Customer Screen

## Reason

Maintains consistency throughout the application.

## Impact

Positive

Simpler maintenance and onboarding.
---

**End of Architecture Decision Log**