# 🏆 Architect Observation 013

# Data Must Live Where It Is Owned

---

## Business Situation

During almost every table design session, one question kept appearing:

> "Does this data really belong here?"

Instead of accepting the first answer, we kept questioning ownership until the correct table naturally emerged.

Examples included:

- Quantity
- Pending Amount
- Vehicle
- Product
- Payment Allocation
- BatchID

---

## Problem

One of the biggest causes of poor database design is storing the same business information in multiple places.

For example:

Current Quantity

Product

Finished Goods

Delivery

If quantity exists in multiple tables, eventually one of them becomes incorrect.

The database loses its single source of truth.

---

## Discovery

Every piece of business data has exactly one owner.

Other tables may reference it.

They should never duplicate ownership.

---

## Why It Matters

When ownership is unclear:

- Duplicate data appears.
- Reports disagree.
- Bugs become difficult to trace.
- Updates become inconsistent.

When ownership is clear:

- Every update has one destination.
- Relationships remain simple.
- Maintenance becomes easier.
- Future features become safer.

---

## Impact on Database Design

This principle influenced nearly every module.

### Product

Owns product specifications.

Never owns stock.

---

### Finished Goods Stock

Owns available inventory.

---

### Order

Owns customer commitment.

---

### Delivery

Owns logistics.

---

### Payment

Owns money received.

---

### Payment Allocation

Owns financial distribution.

---

## Real Business Example

Example:

Pending Amount

Wrong Design

Stored in:

- Customer
- Order
- Payment

Correct Design

Pending Amount is **not stored**.

It is calculated from:

Orders

−

Payments

This guarantees one version of the truth.

---

## Final Architect Principle

> **Every business fact must have exactly one owner.**

Other tables may reference it.

They must never compete with it.

Ownership creates consistency.

---

## Future Impact

This principle will guide future modules such as:

- Employee Management
- Expenses
- Machinery
- Maintenance
- Payroll
- AI Analytics

Whenever a new column is proposed, the first question should be:

> **"Which table truly owns this information?"**

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 013 |
| Category | Database Architecture |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 2 |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- Product
- Finished Goods Stock
- Order
- Delivery
- Payment
- Payment Allocation

---

## Related Observations

- Observation-002 — Inventory Owns Fluctuating Data
- Observation-007 — Every Table Owns Exactly One Responsibility
- Observation-009 — Design Business Flow Before Designing Tables