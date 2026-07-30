# 🏆 Architect Observation 002

# Inventory Owns Fluctuating Data

---

## Business Situation

During the design of the Product and Inventory tables, an important business question arose:

> **Where should the current quantity be stored?**

At first glance, storing quantity in the Product table seemed simple.

However, after discussing how the factory actually works, we realized this would create inconsistencies throughout the system.

---

## Problem

A Product describes **what the business manufactures**.

Inventory describes **how much currently exists**.

If quantity is stored in Product:

- Every purchase changes Product.
- Every production changes Product.
- Every delivery changes Product.
- Every stock adjustment changes Product.

The Product table would constantly change, even though the product itself never changed.

---

## Discovery

The product itself is stable.

The stock is dynamic.

These are two completely different business concepts.

Therefore:

- Product should describe the item.
- Inventory should describe the quantity.

---

## Why It Matters

Separating Product from Inventory gives the system a single source of truth for stock.

Every stock movement becomes traceable.

Historical reporting becomes accurate.

Future warehouse management becomes possible without redesign.

---

## Impact on Database Design

This observation influenced multiple tables.

### Product

Stores:

- Name
- Size
- Specification

Never stores quantity.

---

### Raw Material Stock

Stores raw material quantities.

---

### Curing Stock

Stores work-in-progress quantities.

---

### Finished Goods Stock

Stores saleable quantities.

---

### Delivery

Consumes inventory.

---

## Real Business Example

Consider a 6" Block.

The specification never changes.

```
6" × 8" × 16"
```

But the quantity changes every day.

Morning

600 Blocks

↓

Production

+200

↓

Delivery

-150

↓

Adjustment

-10

↓

Current

640 Blocks

Only Inventory should change.

The Product remains exactly the same.

---

## Final Architect Principle

> **Master Data describes the business.**

> **Inventory describes the current business state.**

Never mix stable business information with changing operational data.

---

## Future Impact

This observation supports future features such as:

- Multiple warehouses
- Warehouse transfers
- Inventory valuation
- Batch tracking
- AI inventory forecasting
- Stock ageing reports

Without separating Product and Inventory, these features would require major redesign.

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 002 |
| Category | Database Architecture |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 2 |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- Product
- Raw Material Stock
- Curing Stock
- Finished Goods Stock
- Delivery Item

---

## Related Observations

- Observation-001 — Business Thinks Customer First
- Observation-003 — Production is Not Finished Goods *(Upcoming)*