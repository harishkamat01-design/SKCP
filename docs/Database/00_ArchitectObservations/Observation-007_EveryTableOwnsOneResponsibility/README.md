# 🏆 Architect Observation 007

# Every Table Owns Exactly One Responsibility

---

## Business Situation

Throughout Sprint 2, every time we designed a table, we repeatedly asked:

> "Does this information really belong here?"

Instead of adding more columns, we moved information into the table that truly owned it.

This simple question shaped the entire SKCP database.

---

## Problem

Many beginner database designs try to store everything in one table.

Example:

Order Table

- Customer
- Products
- Payment
- Vehicle
- Delivery Status
- Stock

This appears simple initially.

Later it becomes impossible to maintain.

---

## Discovery

Every table should answer **one business question**.

Nothing more.

Nothing less.

When every table owns exactly one responsibility:

- Changes become easier.
- Bugs become smaller.
- Future features become simpler.
- Relationships become meaningful.

---

## Why It Matters

A database is easier to maintain when every table has a clear purpose.

When responsibilities are mixed:

- Duplicate data appears.
- Update anomalies occur.
- Business rules become confusing.
- Future changes require major redesign.

---

## Impact on Database Design

This principle influenced every table.

### Product

Owns product information.

Never owns stock.

---

### Finished Goods Stock

Owns inventory.

Never owns product specifications.

---

### Order

Owns the customer transaction.

Never owns products.

---

### Order Item

Owns ordered products.

Never owns customer information.

---

### Delivery

Owns logistics.

Never owns inventory.

---

### Payment

Owns money received.

Never owns allocations.

---

### Payment Allocation

Owns accounting distribution.

Nothing else.

---

## Real Business Example

Instead of:

Order

- Customer
- Product
- Quantity
- Vehicle
- Driver
- Payment
- Pending

SKCP separates everything:

Customer

↓

Order

↓

Order Item

↓

Delivery

↓

Delivery Item

↓

Payment

↓

Payment Allocation

Each table becomes small, clean and focused.

---

## Final Architect Principle

> **One Table.**

> **One Responsibility.**

If a column answers a different business question,

it probably belongs in another table.

---

## Future Impact

This observation enables:

- Easier maintenance
- Better scalability
- Cleaner APIs
- Easier testing
- Lower coupling
- Faster feature development

Every future module should follow this same principle.

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 007 |
| Category | Database Design |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 2 |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- All Database Tables

---

## Related Observations

- Observation-002 — Inventory Owns Fluctuating Data
- Observation-004 — One Vehicle Trip Equals One Delivery
- Observation-005 — The System Performs Accounting