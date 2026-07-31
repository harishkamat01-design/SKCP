# Finished Goods Stock (Transaction Table)

---

# Purpose

The Finished Goods Stock table stores the current saleable inventory available in the Sales Yard.

Only products that have completed the curing process and have been approved by the owner are transferred into this table.

---

# Business Responsibility

The Finished Goods Stock table answers:

- How many finished blocks are available for sale?
- Is stock sufficient to fulfil customer orders?
- Which products require new production?
- Has stock fallen below the minimum level?

---

# Table Structure

| Column | Type | Description |
|----------|------|-------------|
| FinishedGoodsStockID (PK) | UUID / INT | Unique stock record |
| ProductID (FK) | FK | Product reference |
| CurrentQuantity | INT | Current saleable quantity |
| MinimumQuantity | INT | Minimum stock level |
| LastUpdatedDate | DATE | Last inventory update |
| Status | ENUM | Normal / Low Stock / Out of Stock |
| Notes | TEXT | Additional remarks |

---

# Primary Key

FinishedGoodsStockID

---

# Foreign Key

ProductID → Product(ProductID)

Relationship:

One Product

↓

One Finished Goods Stock Record

---

# Business Rules

## Rule 1

Only cured and approved products may enter Finished Goods Stock.

---

## Rule 2

Finished Goods Stock stores only the latest inventory position.

Historical movements are maintained in:

- Curing Stock
- Delivery

---

## Rule 3

Blocks are managed as one combined stock.

The business does not maintain production batch information once products enter the Sales Yard.

---

## Rule 4

Reserved Stock is not maintained in Version 1.

Customer orders reduce available stock only when products are dispatched.

---

## Rule 5

MinimumQuantity is maintained for every finished product.

When CurrentQuantity falls below MinimumQuantity,

the system should recommend new production.

---

## Rule 6

Status is determined from CurrentQuantity.

Examples:

- CurrentQuantity > MinimumQuantity → Normal
- CurrentQuantity ≤ MinimumQuantity → Low Stock
- CurrentQuantity = 0 → Out of Stock

---

# Business Workflow

Production

↓

Curing Stock

↓

Owner Approval

↓

Finished Goods Stock

↓

Customer Order

↓

Delivery

---

# Example

| Product | Current Quantity | Minimum Quantity | Status |
|----------|-----------------:|-----------------:|--------|
| 4" Block | 1,250 | 500 | Normal |
| 6" Block | 350 | 400 | Low Stock |
| 8" Block | 0 | 200 | Out of Stock |

---

# Why This Design?

This design mirrors how SKCP currently operates.

The Sales Yard maintains only the total available stock for each product.

Production batch tracking is intentionally excluded from Version 1 to keep the system simple while accurately reflecting the existing business process.

---

# Future Scope

Future versions may include:

- Batch-wise Finished Stock
- FIFO Stock Allocation
- Batch Traceability
- Warehouse Locations
- Reserved Stock
- Automatic Production Suggestions
- AI Demand Forecasting

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