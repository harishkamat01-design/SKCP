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

## Status

Domain:
Inventory

Data Classification:
Transaction Data

Owner:
Inventory Management

Status:
✅ Frozen

Date:
30th July 2026

