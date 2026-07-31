# 🧱 Raw Material

# Raw Material

## Purpose

The Raw Material table stores the permanent information about every raw material used in the manufacturing process.

It defines **what** the material is.

It does **not** store purchasing history or inventory quantities.

---

# Raw Material Table

| Column | Type | Description |
|---------|------|-------------|
| RawMaterialID (PK) | UUID / INT | Unique raw material |
| MaterialName | VARCHAR(100) | Name of the material |
| MaterialCategory | VARCHAR(50) | Category (Cement, Sand, Fly Ash, Jelly, Water, etc.) |
| Description | TEXT | Optional description |
| Status | ENUM | Active / Inactive |

---

# Business Relationship

Purchase Item

Many

↓

1

Raw Material

---

# Business Event

Example

The factory defines:

- Cement
- Sand
- Fly Ash
- Jelly
- Water

These materials are created once and reused across every purchase.

Whenever materials are purchased, Purchase Item references the appropriate Raw Material.

---

# What Does NOT Belong Here

The following information belongs elsewhere:

Purchase Item

- Quantity Purchased
- Purchase Unit
- Unit Price
- Purchase Amount

Inventory

- Current Stock
- Available Stock
- Minimum Stock
- Reorder Level

Purchase

- Supplier
- Invoice Number
- Purchase Date

Raw Material stores only the identity of the material.

---

# Architect Decision

Raw Material is Master Data.

It identifies the material itself and remains relatively stable over time.

Dynamic information such as stock levels and purchase history is stored in transaction tables.

This separation follows normalization and prevents duplicate data.

---

# Interview Takeaway

Master Data defines business entities.

Transaction Data records business activities involving those entities.

Raw Material is a classic Master Data table because it defines reusable business information.

---

# Beautiful Symmetry

| Sales Domain | Purchase Domain |
|--------------|-----------------|
| Product | Raw Material |
| Order Item | Purchase Item |
| Inventory | Raw Material Inventory |

Products define what is sold.

Raw Materials define what is consumed during manufacturing.

---

# Architect Lesson

A Raw Material table should answer only one question:

**"What material exists in the factory?"**

It should never answer:

- How much was purchased?
- How much stock is available?
- Who supplied it?

Those belong to other business objects.

Keeping responsibilities separate creates a scalable ERP database.

---

# Status
**Date:** 30th July 2026

**Status:** ✅ Frozen

**Domain:** Procurement

**Owner:** Material Management

**Related Tables:**

- Purchase Item
- Inventory (Raw Material Inventory – Future)
