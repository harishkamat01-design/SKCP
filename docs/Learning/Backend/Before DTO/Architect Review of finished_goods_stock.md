# 🏛 Architect Review
## finished_goods_stock Table
**Project:** SKCP – Shree Kundodari Cement Products  
**Module:** Inventory Domain  
**Review Date:** 06 August 2026  
**Reviewer:** Project Architect

---

# Purpose of the Table

The `finished_goods_stock` table represents the **current inventory state** of saleable finished products.

Unlike Production or Sales tables, this table **does not store transactions**.

It stores the **latest stock position** for each finished product.

Think of it as the inventory dashboard for finished goods.

---

# Business Responsibility

This table answers questions such as:

- How many blocks are available today?
- Is stock running low?
- Which product is out of stock?
- Which products need production?
- Which products are safe for customer delivery?

It is the primary inventory table for finished products.

---

# Domain Placement

```text
Production
      │
      ▼
Curing Stock
      │
      ▼
Finished Goods Stock
      │
      ▼
Sales Order
      │
      ▼
Delivery
```

Finished Goods Inventory acts as the bridge between Production and Sales.

---

# Table Classification

| Attribute | Value |
|------------|-------|
| Domain | Inventory |
| Data Type | Master-like Operational State |
| Nature | Current Inventory Snapshot |
| Update Frequency | Daily |
| Owner | Inventory Module |

---

# Relationship Review

## Product → Finished Goods Stock

```text
Product (1)
        │
        │
        ▼
FinishedGoodsStock (1)
```

One product has one current inventory record.

Therefore:

```sql
product_id UNIQUE
```

is the correct design.

---

# Column Review

---

## finished_goods_stock_id

```sql
finished_goods_stock_id SERIAL PRIMARY KEY
```

Purpose:

Unique identifier.

Architect Verdict:

✅ Correct.

---

## product_id

```sql
product_id INT NOT NULL UNIQUE
```

Purpose:

Identifies which product this inventory belongs to.

Reason for UNIQUE:

Only one inventory record exists per product.

Architect Verdict:

✅ Excellent design.

---

## current_stock_level

```sql
current_stock_level INT
```

(Previously `current_quantity`)

Purpose:

Represents current available inventory.

Example

```text
6 inch Blocks

Current Stock = 1450
```

This value changes after:

- Production
- Sales
- Delivery
- Adjustments

Architect Verdict:

⭐⭐⭐⭐⭐

Renaming to `current_stock_level` is the correct business terminology.

---

## minimum_stock_level

```sql
minimum_stock_level INT
```

(Previously `minimum_quantity`)

Purpose:

Defines the reorder threshold.

Example

```text
Current Stock = 450

Minimum Stock = 500

→ LOW STOCK
```

Architect Verdict:

⭐⭐⭐⭐⭐

Much better naming.

---

## last_updated_date

```sql
last_updated_date DATE
DEFAULT CURRENT_DATE
```

Purpose:

Stores the date inventory was last updated.

Useful for:

- Inventory audit
- Daily closing
- Stock reports

Architect Verdict:

✅ Good.

---

## status

```sql
status
```

Possible values

```text
NORMAL

LOW_STOCK

OUT_OF_STOCK
```

Purpose:

Represents inventory health.

Should be updated automatically.

Example

```text
current_stock_level = 0

↓

status = OUT_OF_STOCK
```

Architect Recommendation

Eventually calculate automatically inside the Service Layer.

Architect Verdict:

⭐⭐⭐⭐⭐

---

## notes

Purpose:

Stores manual remarks.

Example

```text
Stock damaged due to rain.

Inventory manually corrected.

Physical stock mismatch.
```

Architect Verdict:

Useful.

---

## created_at

Purpose:

Audit information.

Never changes.

Architect Verdict:

Correct.

---

# Naming Improvement

Original

```text
current_quantity

minimum_quantity
```

Updated

```text
current_stock_level

minimum_stock_level
```

This improves consistency with inventory terminology.

Transaction tables use:

```text
quantity_produced

quantity_delivered

quantity_ordered
```

Inventory tables use:

```text
current_stock_level

minimum_stock_level
```

This cleanly separates:

**Transactions** from **Inventory State**.

---

# Why This Table Exists

Imagine 5,000 blocks produced.

Instead of calculating stock every time using:

Production

− Delivery

− Damage

− Adjustments

The system stores the latest stock.

This makes:

Dashboard

Reports

Customer Orders

Inventory Lookup

very fast.

---

# Future Enhancement Opportunities

Future versions may include:

```text
reserved_stock_level

damaged_stock_level

blocked_stock_level

available_stock_level

maximum_stock_level

reorder_quantity

warehouse_location

last_stock_count_date
```

Current Version intentionally keeps the design simple.

---

# Business Workflow

```text
Production Completed
        │
        ▼
Move to Curing Stock
        │
        ▼
Ready After Curing
        │
        ▼
Finished Goods Stock
        │
        ▼
Customer Order
        │
        ▼
Delivery
        │
        ▼
Reduce Current Stock
```

---

# Architectural Assessment

| Category | Rating |
|----------|--------|
| Naming | ⭐⭐⭐⭐⭐ |
| Normalization | ⭐⭐⭐⭐⭐ |
| Relationships | ⭐⭐⭐⭐⭐ |
| Business Mapping | ⭐⭐⭐⭐⭐ |
| Simplicity | ⭐⭐⭐⭐⭐ |
| Future Scalability | ⭐⭐⭐⭐⭐ |

---

# Architect Verdict

The revised `finished_goods_stock` table is now much closer to an enterprise inventory design.

The renaming to:

```text
current_stock_level

minimum_stock_level
```

aligns the schema with inventory terminology and clearly distinguishes inventory state from transactional quantities.

The table is:

- Business-friendly
- Properly normalized
- Scalable
- Easy to understand
- Consistent with ERP design principles

This table is approved as the Version 1 implementation for Finished Goods Inventory.

---

**Reviewed By**

**Project Architect**

SKCP – Architecture First • Business First • Engineering Excellence