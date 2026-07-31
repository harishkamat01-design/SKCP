# ADR-DB-004

# Title

Separate Master Data from Transaction Data

---

## Status

✅ Accepted

---

## Date

31-Jul-2026

---

## Context

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

## Decision

The database shall be divided into two major categories:

### Master Data

Stores permanent business entities.

Examples:

- Asset
- Customer
- Labour
- Product
- RawMaterial
- Supplier

---

### Transaction Data

Stores business events that occur over time.

Examples:

- Purchase
- PurchaseItem
- Production
- Attendance
- Order
- OrderItem
- Delivery
- DeliveryItem
- Payment
- PaymentAllocation

---

### Inventory Tables

Inventory tables maintain the current business position while transaction tables preserve historical records.

Examples:

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

## Rationale

This separation provides:

- Reduced data duplication
- Better normalization
- Easier maintenance
- Clear business ownership
- Faster reporting
- Easier backend development
- Better scalability

Master information is entered once and referenced everywhere using foreign keys.

---

## Design Principle

```
Master Data

        │

Referenced By

        │

Transaction Data

        │

Updates

        │

Inventory
```

---

## Consequences

### Positive

- Customer information exists only once.
- Product information exists only once.
- Supplier information exists only once.
- Transaction history remains immutable.
- Easier auditing.
- Cleaner database relationships.
- Simpler REST API design.
- Easier implementation using Spring Data JPA.

### Negative

- Every transaction requires foreign key validation.
- Master records must exist before transactions can be created.

---

## Business Rules

- Every Customer must exist before an Order is created.
- Every Supplier must exist before a Purchase is created.
- Every Product must exist before Production or Sales.
- Every Raw Material must exist before Procurement.
- Transactions never duplicate master information.
- Master records may be updated without affecting historical transactions.
- Transaction history is never deleted.

---

## Alternatives Considered

### Option 1

Store customer, supplier, and product information directly inside transaction tables.

**Rejected**

Reason:

- High redundancy
- Update anomalies
- Difficult maintenance
- Violates normalization principles

---

### Option 2

Separate Master and Transaction tables.

**Accepted**

Reason:

Provides a normalized, scalable, and maintainable ERP database design.

---

## Impact

Affected Tables

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
- Order
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

## Related Documents

- Database_Data_Dictionary.md
- Database_Relationship_Summary.md
- Master_ER_Diagram.md
- PostgreSQL_Schema.sql

---

## Decision Owner

Harish Kamat

---

## Review Status

✅ Approved