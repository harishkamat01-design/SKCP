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

**Domain:** Raw Materials

**Owner:** Master Data

**Related Tables:**

- Purchase Item
- Inventory (Raw Material Inventory – Future)

---

## Purpose

The **Raw Material** table stores the permanent list of raw materials used in manufacturing cement products at SKCP.

It answers the business question:

> **"What raw materials does SKCP use?"**

This is **Master Data**, meaning the list changes only when a new material is introduced.

This table **does not** store stock quantities, purchase prices, suppliers, or purchase transactions.

---

## Business Questions Answered

This table helps answer:

- What raw materials does SKCP use?
- What is the standard unit of each material?
- What is the minimum stock level for planning?
- Is the material currently active?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| RawMaterialID (PK) | Unique material identifier | Identifies each raw material |
| MaterialName | Cement, Sand, Jelly, Fly Ash, Chemical Admixture | Permanent business name |
| Unit | Bag, Tractor Load, Kg, Litre | Standard measurement unit |
| MinimumStockLevel | Minimum quantity before reorder | Inventory planning |
| Description | Optional notes | Additional information |
| Status | Active / Inactive | Indicates whether the material is currently used |

---

## Current SKCP Raw Materials

- Cement
- Sand
- Jelly
- Fly Ash
- Chemical Admixture

> New materials are added by creating new records, not by changing the database structure.

---

## Business Relationship

```text
              Raw Material
                    │
                    ▼
             Purchase Item
                    │
                    ▼
        Raw Material Stock
```

One Raw Material can appear in:

- Multiple Purchase Items
- One Raw Material Stock record

---

## Business Rules

- Every raw material must have a unique RawMaterialID.
- Raw Material is Master Data.
- One material can be purchased many times.
- One material has one current stock record.
- Materials are marked Inactive instead of being deleted.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Current Stock | Raw Material Stock | Stock fluctuates daily |
| Purchase Price | Purchase Item | Price changes every purchase |
| Supplier Name | Supplier | One material can have many suppliers |
| Purchase Date | Purchase | Transaction information |
| Quantity Purchased | Purchase Item | Purchase transaction detail |

---

## Architect Discoveries

During business analysis, we discovered several important principles:

### Beautiful Separation

- Raw Material stores **what SKCP uses**.
- Purchase Item stores **what SKCP bought**.
- Raw Material Stock stores **what SKCP currently has**.

Each table has exactly one responsibility.

---

### Business Relationship

A Raw Material is **not directly connected to Supplier**.

The relationship is naturally discovered through:

```text
Supplier

↓

Purchase

↓

Purchase Item

↓

Raw Material
```

This allows:

- One supplier to supply many materials.
- One material to be purchased from many suppliers.

---

### Inventory Ownership

Raw Material does **not** own Current Stock.

Inventory owns Current Stock.

This was one of the biggest architecture discoveries during Sprint 2.

---

## Architect Decisions

- Raw Material is a Master Data table.
- Stock is maintained separately.
- Purchase Price is maintained separately.
- Supplier relationship is discovered through Purchase transactions.
- New materials are added as records, not columns.

---

## Future Enhancements

Possible future additions:

- Material Category
- Material Image
- Standard Supplier
- Reorder Quantity
- Storage Location
- Material Specification Sheet

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Master Data |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |