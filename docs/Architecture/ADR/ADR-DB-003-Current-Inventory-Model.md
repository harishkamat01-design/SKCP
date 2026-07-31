# ADR-DB-003

# Title

Maintain Current Inventory Separately from Historical Transactions

---

## Status

✅ Accepted

---

## Date

31-Jul-2026

---

## Context

SKCP requires fast access to the current inventory position while preserving the complete business history.

The business needs to answer questions such as:

- How much cement is available right now?
- How many blocks are currently curing?
- How many finished blocks are available for sale?

At the same time, the system must preserve:

- Purchase history
- Production history
- Delivery history

Using transaction tables alone would require expensive calculations every time current stock is requested.

---

## Decision

Separate inventory into **Current Inventory Tables** and **Historical Transaction Tables**.

Current Inventory Tables

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

Historical Transaction Tables

- Purchase
- PurchaseItem
- Production
- Delivery
- DeliveryItem

Current stock is updated automatically whenever a business transaction occurs.

---

## Rationale

This design provides:

- Fast inventory lookup
- Complete transaction history
- Simple reporting
- Better scalability
- Reduced query complexity

Instead of calculating stock from thousands of historical transactions every time, the application simply reads the current stock tables.

---

## Inventory Flow

```
Purchase
      │
      ▼
RawMaterialStock

      │
      ▼
Production

      │
      ▼
CuringStock

      │
      ▼
FinishedGoodsStock

      │
      ▼
Delivery
```

---

## Consequences

### Positive

- Real-time inventory lookup
- Historical transactions never modified
- Better reporting performance
- Easier backend implementation
- Supports future AI forecasting

### Negative

- Inventory tables must always remain synchronized with transactions.
- Requires transactional updates to prevent inconsistencies.

---

## Alternatives Considered

### Option 1

Calculate inventory from transaction history every time.

**Rejected**

Reason:

- Slow queries
- Complex calculations
- Poor scalability

---

### Option 2

Maintain dedicated inventory tables.

**Accepted**

Reason:

Provides immediate inventory visibility while preserving a complete audit trail.

---

## Business Rules

- RawMaterialStock stores only the current available quantity.
- FinishedGoodsStock stores only sale-ready products.
- CuringStock stores products currently under curing.
- Purchase history is never deleted.
- Production history is never deleted.
- Delivery history is never deleted.
- Inventory is updated automatically after each business transaction.
- Current stock is never entered manually.

---

## Impact

Affected Tables

- Purchase
- PurchaseItem
- Production
- Delivery
- DeliveryItem
- RawMaterialStock
- CuringStock
- FinishedGoodsStock

Affected Documents

- Database Relationship Summary
- Master ER Diagram
- PostgreSQL Physical Schema

---

## Decision Owner

Harish Kamat

---

## Review Status

✅ Approved

---

## Related Documents

- Database_Relationship_Summary.md
- Master_ER_Diagram.md
- PostgreSQL_Schema.sql