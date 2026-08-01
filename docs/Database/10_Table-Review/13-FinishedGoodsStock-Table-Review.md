# Table Review 13 — Finished Goods Stock

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Finished Goods Stock

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Finished Goods Stock table stores the **current saleable inventory** available in the Sales Yard.

This is an **Inventory Table**.

It represents the **Current Position** of finished goods inventory.

It receives stock from:

- Production (after curing is completed)

It supplies stock to:

- Customer Delivery

It does **not** store inventory movement history.

Inventory movement history is maintained through:

- Production
- Delivery

---

## Business Owner

Inventory Domain

---

## Table Type

Current Position Table

---

## Primary Key

FinishedGoodsStockID

### Purpose

Uniquely identifies each finished goods stock record.

---

## Architecture Validation

| Check | Status |
|--------|--------|
| Business Driven | ✅ |
| Single Responsibility | ✅ |
| Normalized | ✅ |
| Future Ready | ✅ |
| Business Rules Covered | ✅ |

---

## Architect Verdict

Approved without structural changes.

---

# Step 2 — PostgreSQL Physical Table

```sql
-- ==========================================================
-- Table : finished_goods_stock
-- Domain: Inventory
-- Purpose: Stores current saleable finished goods stock
-- ==========================================================

CREATE TABLE finished_goods_stock
(
    finished_goods_stock_id SERIAL PRIMARY KEY,

    product_id INT NOT NULL,

    current_quantity INT NOT NULL DEFAULT 0,

    minimum_quantity INT DEFAULT 0,

    last_updated_date DATE
        NOT NULL
        DEFAULT CURRENT_DATE,

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'NORMAL'
        CHECK (status IN ('NORMAL', 'LOW_STOCK', 'OUT_OF_STOCK')),

    notes TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_finished_goods_stock_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);
```

---

# Step 3 — Three-Layer Explanation

---

## Line 1

```sql
CREATE TABLE finished_goods_stock
```

### SQL Syntax

Creates a new table named **finished_goods_stock**.

### Database Concept

A table stores one type of business information.

### SKCP Context

Stores the current saleable finished goods inventory.

---

## Line 2

```sql
finished_goods_stock_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates unique IDs.

### Database Concept

Every table requires one unique identifier.

### SKCP Context

Each finished goods stock record receives a unique ID.

---

## Line 3

```sql
product_id INT NOT NULL
```

### SQL Syntax

Foreign Key reference to Product.

### Database Concept

Finished goods belong to one product.

### SKCP Context

Example:

- 4-inch Solid Block
- 6-inch Solid Block
- 8-inch Solid Block

Each has its own stock quantity.

---

## Line 4

```sql
current_quantity INT NOT NULL DEFAULT 0
```

### SQL Syntax

Stores the available quantity.

Default = 0.

### Database Concept

Represents the current inventory position.

### SKCP Context

This is the number shown to the Admin before confirming customer orders.

---

## Line 5

```sql
minimum_quantity INT DEFAULT 0
```

### SQL Syntax

Stores the minimum desired stock level.

### Database Concept

Supports future inventory alerts.

### SKCP Context

When stock falls below this value,

the system can recommend new production.

---

## Line 6

```sql
last_updated_date DATE
DEFAULT CURRENT_DATE
```

### SQL Syntax

Automatically stores today's date.

### Database Concept

Records when stock was last modified.

### SKCP Context

Updates whenever stock changes because of:

- Production
- Delivery

---

## Line 7

```sql
status VARCHAR(20)
DEFAULT 'NORMAL'
CHECK (...)
```

### SQL Syntax

Allowed values:

- NORMAL
- LOW_STOCK
- OUT_OF_STOCK

### Database Concept

CHECK constraint protects the database.

### SKCP Context

Allows the dashboard to quickly identify stock conditions.

---

## Line 8

```sql
notes TEXT
```

### SQL Syntax

Stores optional remarks.

### Database Concept

Flexible comments field.

### SKCP Context

Examples:

- Stock verification completed
- Damaged blocks removed
- Manual correction

---

## Line 9

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically records creation date and time.

### Database Concept

Audit field.

### SKCP Context

Useful for:

- Reporting
- Debugging
- Audit

---

## Line 10

```sql
FOREIGN KEY (product_id)
REFERENCES product(product_id)
```

### SQL Syntax

Creates a relationship with Product.

### Database Concept

Each stock record belongs to exactly one product.

### SKCP Context

Without Product,

Finished Goods Stock cannot exist.

Relationship:

Product

↓

Finished Goods Stock

---

# Step 4 — Architect Notes

### Why separate Finished Goods Stock from Production?

Production stores **what happened**.

Finished Goods Stock stores **what is currently available**.

This follows our architectural principle:

**Current Position + Historical Transactions**

---

### Why not calculate stock every time?

Current stock is frequently accessed.

Keeping the current position improves performance.

Historical movement remains in transaction tables.

---

### Why CURRENT_DATE?

Inventory updates occur daily.

Time is usually unnecessary for stock updates.

---

# Step 5 — Validation Checklist

| Validation | Status |
|------------|--------|
| Business Rule Verified | ✅ |
| Naming Convention | ✅ |
| PostgreSQL Compatible | ✅ |
| Normalized | ✅ |
| Data Integrity | ✅ |
| Future Ready | ✅ |
| Spring Boot Friendly | ✅ |

---

# Step 6 — Architect Approval

## Finished Goods Stock Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (FinishedGoodsStock.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Dashboard Inventory Module

---

# 📘 Lesson Summary

Today you additionally learned:

- Difference between Production and Inventory
- Current Position vs Historical Transactions
- Why inventory tables should not store movement history
- How Foreign Keys connect Product to Inventory

---

## Architect Verdict

Excellent.

Finished Goods Stock completes the Inventory domain for Version 1.

The three inventory tables now follow the same architecture:

- Raw Material Stock
- Curing Stock
- Finished Goods Stock

All follow the **Current Position + Historical Transactions** principle established in the Architecture Decision Records (ADR).