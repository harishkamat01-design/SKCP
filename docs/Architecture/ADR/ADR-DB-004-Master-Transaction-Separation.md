# ADR-DB-004

# Title

Separate Master Data from Transaction Data

---

## ADR ID

ADR-DB-004

---

## Module

Module 3 – Database Design

---

## Version

2.0

---

## Status

✅ Accepted

---

## Date

31-Jul-2026

---

## Author

Harish Kamat

---

# Context

The SKCP system manages two fundamentally different types of information:

1. Stable business entities that change infrequently.
2. Daily business transactions that are continuously created.

Mixing these two types of data in the same tables would lead to:

- Data duplication
- Update anomalies
- Poor maintainability
- Inconsistent business information

The database architecture must clearly distinguish long-lived business entities from operational events.

---

# Architecture Principle

SKCP follows a **Business-First Database Design**.

Business entities (people, products, suppliers, assets) are stored separately from business events (orders, purchases, production, deliveries, and payments).

This separation keeps business identities stable while allowing business transactions to grow indefinitely.

---

# Decision

The database shall be divided into three major categories.

---

## Master Data

Stores permanent business entities.

Examples:

- Asset
- Customer
- Labour
- Product
- RawMaterial
- Supplier

---

## Transaction Data

Stores business events that occur over time.

Examples:

- Purchase
- PurchaseItem
- Production
- Attendance
- Orders
- OrderItem
- Delivery
- DeliveryItem
- Payment
- PaymentAllocation

---

## Inventory

Inventory tables maintain the **current business position**, while transaction tables preserve historical records.

Examples:

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

# Rationale

This separation provides:

- Reduced data duplication
- Better normalization (Third Normal Form)
- Easier maintenance
- Clear business ownership
- Faster reporting
- Easier backend development
- Better scalability

Master information is entered once and referenced everywhere using foreign keys.

Inventory is maintained as a separate **current-state layer** instead of recalculating stock from historical transactions.

This significantly improves reporting performance and simplifies backend processing.

---

# Design Principle

```text
Business

        │

        ▼

Master Data

        │
        │ Referenced By
        ▼

Transaction Data

        │
        │ Updates
        ▼

Inventory

        │
        ▼

Reports

        │
        ▼

AI
```

---

# Consequences

## Positive

- Customer information exists only once.
- Supplier information exists only once.
- Product information exists only once.
- Asset information exists only once.
- Reduced data redundancy.
- Better normalization.
- Complete audit trail.
- Historical transactions remain immutable.
- Faster reporting.
- Cleaner database relationships.
- Easier Spring Boot Entity mapping.
- Simpler REST API design.
- Better scalability.

---

## Negative

- Every transaction requires foreign key validation.
- Master records must exist before transactions can be created.
- Inventory synchronization must be maintained by application logic.

---

# Business Rules

- Every Customer must exist before an Order is created.
- Every Supplier must exist before a Purchase is created.
- Every Product must exist before Production or Sales.
- Every Raw Material must exist before Procurement.
- Every Labour must exist before Attendance is recorded.
- Every Asset must exist before Production is recorded.
- Master records own business identities.
- Transaction records reference Master Data using foreign keys.
- Inventory is maintained from transaction processing.
- Transactions never duplicate master information.
- Historical transaction records are immutable.
- Transaction history is never deleted.

---

# Alternatives Considered

## Option 1

Store customer, supplier, product, and asset information directly inside transaction tables.

**Rejected**

Reason:

- High redundancy
- Update anomalies
- Difficult maintenance
- Violates Third Normal Form (3NF)

---

## Option 2

Separate Master Data and Transaction Data.

**Accepted**

Reason:

Provides a normalized, scalable, maintainable, and ERP-ready database architecture.

---

# Impact

## Affected Tables

### Master Data

- Asset
- Customer
- Labour
- Product
- RawMaterial
- Supplier

### Transaction Data

- Purchase
- PurchaseItem
- Production
- Attendance
- Orders
- OrderItem
- Delivery
- DeliveryItem
- Payment
- PaymentAllocation

### Inventory

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

# Future Benefits

This architecture supports future implementation of:

- AI Forecasting
- Dashboard Analytics
- Mobile Application
- Multi-user Support
- Multi-factory Expansion
- ERP Reporting
- Business Intelligence
- Predictive Analytics

---

# Decision Summary

Separating Master Data, Transaction Data, and Inventory establishes a clean ERP architecture that is scalable, normalized, and aligned with real-world business operations.

This decision forms one of the core architectural foundations of the SKCP system and will guide future backend, API, reporting, and AI development.

---

# Related Documents

- Database_Data_Dictionary.md
- Database_Relationship_Summary.md
- Master_ER_Diagram.md
- PostgreSQL_Schema.sql

---

# Review Status

✅ Approved