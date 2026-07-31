# 📦 Raw Material Stock

# Raw Material Stock (Transaction Table)

---

# Purpose

Stores the current available stock of every raw material.

Unlike Purchase and Production tables, this table represents the latest inventory position rather than historical transactions.

---

# Business Responsibility

The Raw Material Stock table answers:

- How many cement bags are available?
- How much sand is currently available?
- Is stock sufficient for production?
- Should new materials be purchased?

---

# Table Structure

| Column | Type | Description |
|----------|------|-------------|
| RawMaterialStockID (PK) | UUID / INT | Unique stock record |
| RawMaterialID (FK) | FK | Raw material |
| CurrentQuantity | DECIMAL(10,2) | Current available quantity |
| MinimumQuantity | DECIMAL(10,2) | Minimum stock level (nullable) |
| LastUpdatedDate | DATE | Last stock update |
| Status | ENUM | Normal / Low Stock / Out of Stock |
| Notes | TEXT | Additional remarks |

---

# Primary Key

RawMaterialStockID

---

# Foreign Key

RawMaterialID → RawMaterial(RawMaterialID)

Relationship:

One Raw Material

↓

One Current Stock Record

---

# Business Rules

## Rule 1

Every raw material has exactly one current stock record.

---

## Rule 2

This table stores only the latest stock position.

Historical movements are recorded in:

- Purchase
- Purchase Item
- Production

---

## Rule 3

Units are not stored in this table.

The unit belongs to the RawMaterial master.

Example:

CurrentQuantity = 280

RawMaterial.Unit = Bag

Displayed as:

280 Bags

---

## Rule 4

MinimumQuantity is currently maintained only where required by the business (e.g., Cement).

Other materials may leave this field NULL.

---

## Rule 5

Status is determined from CurrentQuantity.

Example:

- CurrentQuantity > MinimumQuantity → Normal
- CurrentQuantity ≤ MinimumQuantity → Low Stock
- CurrentQuantity = 0 → Out of Stock

---

# Example

| Raw Material | Current Quantity | Minimum | Status |
|--------------|-----------------:|--------:|--------|
| Cement | 280 | 50 | Normal |
| Sand | 2 | NULL | Normal |
| Fly Ash | 1 | NULL | Normal |

---

# Why This Design?

This design separates:

- Transaction History (Purchase & Production)
- Current Inventory Position (Raw Material Stock)

This follows standard ERP inventory practices and avoids recalculating stock from historical transactions every time.

---

# Future Scope

Future versions may include:

- Stock Movement Ledger
- Automatic Reorder Suggestions
- AI-Based Consumption Forecasting
- Warehouse Locations
- Multiple Storage Areas

---

# Status

✅ Frozen (Version 1)

This table accurately represents the current raw material inventory maintained by SKCP while remaining scalable for future enhancements.


---
## OLDVERSION

## Purpose

The **Raw Material Stock** table stores the **current available quantity** of every raw material in SKCP.

It answers the business question:

> **"How much raw material do we have right now?"**

Unlike Purchase Item, this table always represents the **latest stock position**.

Stock continuously increases and decreases as business operations happen.

---

## Business Questions Answered

This table helps answer:

- How much Cement is currently available?
- How much Sand is currently available?
- Which materials are below the minimum stock level?
- Is replenishment required?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| RawMaterialStockID (PK) | Unique stock record | Identifies one inventory record |
| RawMaterialID (FK) | References Raw Material | Which material |
| CurrentQuantity | Current available quantity | Live inventory |
| LastUpdated | Last stock update timestamp | Audit information |
| Remarks | Optional notes | Operational remarks |

---

## Business Relationship

```text
          Raw Material
                 │
                 ▼
        Raw Material Stock
          ▲             ▲
          │             │
     Purchase Item   Production
```

Stock increases through:

- Purchase Item

Stock decreases through:

- Production

---

## Business Rules

- One Raw Material has exactly one Raw Material Stock record.
- Current Quantity always represents the latest physical stock.
- Purchase increases stock.
- Production consumes stock.
- Stock Adjustment transactions may increase or decrease stock.
- Current Quantity is never entered manually during normal business operations.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Purchase Price | Purchase Item | Transaction information |
| Supplier | Supplier | Master Data |
| Purchase Date | Purchase | Purchase transaction |
| Quantity Purchased | Purchase Item | Historical transaction |
| Minimum Stock Level | Raw Material | Planning information |

---

## Architect Discoveries

### Inventory Owns Fluctuating Data

One of the most important discoveries during Sprint 2:

> **Anything that continuously increases and decreases belongs to Inventory.**

Master Data should never own changing quantities.

---

### Beautiful Separation

Raw Material answers:

> What material do we use?

Purchase Item answers:

> What did we buy?

Raw Material Stock answers:

> What do we currently have?

---

### Stock is a Living Value

Unlike Purchase Item, which records history,

Raw Material Stock always stores the **latest available quantity**.

---

## Architect Decisions

- Raw Material Stock belongs to the Inventory domain.
- Inventory owns Current Quantity.
- Purchases increase stock.
- Production decreases stock.
- Future Stock Adjustment transactions will modify stock directly when required.

---

## Future Enhancements

Possible future additions:

- Reserved Quantity
- Available Quantity
- Warehouse Location
- Last Physical Verification Date
- Safety Stock Indicator
- Automatic Reorder Suggestion

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Inventory |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |