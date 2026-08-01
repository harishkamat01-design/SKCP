# Table Review 11 — Raw Material Stock

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Raw Material Stock

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Raw Material Stock table stores the **current available quantity** of each raw material.

This is an **Inventory Current Position** table.

It represents the latest stock level after purchases and consumption.

Historical stock movement is maintained separately through transaction tables such as Purchase and Production.

---

## Business Owner

Inventory Domain

---

## Table Type

Current Position Table

---

## Primary Key

RawMaterialStockID

### Purpose

Uniquely identifies every raw material stock record.

Each raw material has exactly one current stock record.

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
-- Table : raw_material_stock
-- Domain: Inventory
-- Purpose: Stores current stock position of each raw material
-- ==========================================================

CREATE TABLE raw_material_stock
(
    raw_material_stock_id SERIAL PRIMARY KEY,

    raw_material_id INT
        NOT NULL
        UNIQUE
        REFERENCES raw_material(raw_material_id),

    current_quantity DECIMAL(10,2)
        NOT NULL
        DEFAULT 0,

    minimum_quantity DECIMAL(10,2),

    last_updated_date DATE
        NOT NULL
        DEFAULT CURRENT_DATE,

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'NORMAL'
        CHECK (status IN ('NORMAL','LOW_STOCK','OUT_OF_STOCK')),

    notes TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE raw_material_stock
```

### SQL Syntax

Creates a new table named **raw_material_stock**.

### Database Concept

Stores the latest stock position for every raw material.

### SKCP Context

Represents the current raw material inventory inside the factory.

---

## Line 2

```sql
raw_material_stock_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates a unique ID.

### Database Concept

Primary Key uniquely identifies each stock record.

### SKCP Context

Every stock record has its own identifier.

---

## Line 3

```sql
raw_material_id INT
NOT NULL
UNIQUE
REFERENCES raw_material(raw_material_id)
```

### SQL Syntax

Creates a Foreign Key to Raw Material.

`UNIQUE` ensures one stock record per raw material.

### Database Concept

This establishes a **one-to-one relationship** between Raw Material and Raw Material Stock.

### SKCP Context

Only one current stock record should exist for Cement, Sand, Fly Ash, etc.

---

## Line 4

```sql
current_quantity DECIMAL(10,2)
NOT NULL
DEFAULT 0
```

### SQL Syntax

Stores the available quantity.

Default value is zero.

### Database Concept

Inventory starts at zero until purchases are recorded.

### SKCP Context

Shows the quantity currently available in the factory.

---

## Line 5

```sql
minimum_quantity DECIMAL(10,2)
```

### SQL Syntax

Optional field.

### Database Concept

Stores the reorder threshold.

### SKCP Context

Can later be used for automatic low-stock alerts.

---

## Line 6

```sql
last_updated_date DATE
NOT NULL
DEFAULT CURRENT_DATE
```

### SQL Syntax

Automatically stores today's date.

### Database Concept

Tracks when inventory was last modified.

### SKCP Context

Useful for auditing inventory changes.

---

## Line 7

```sql
status VARCHAR(20)
NOT NULL
DEFAULT 'NORMAL'
CHECK (status IN ('NORMAL','LOW_STOCK','OUT_OF_STOCK'))
```

### SQL Syntax

Restricts values to:

- NORMAL
- LOW_STOCK
- OUT_OF_STOCK

### Database Concept

The CHECK constraint protects data integrity.

### SKCP Context

Allows quick visibility of stock condition.

---

## Line 8

```sql
notes TEXT
```

### SQL Syntax

Stores optional remarks.

### Database Concept

Allows recording exceptional inventory notes.

### SKCP Context

Example:

- Wet Cement
- Damaged Bags
- Physical Stock Difference

---

## Line 9

```sql
created_at TIMESTAMP
NOT NULL
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores creation timestamp.

### Database Concept

Provides audit information.

### SKCP Context

Useful for tracking when the stock record was first created.

---

# Step 4 — Architect Notes

### Why Current Stock instead of Stock History?

Inventory is modeled using:

Current Position

+

Historical Transactions

Current Position

↓

raw_material_stock

Historical Transactions

↓

Purchase

↓

Production Consumption

This follows **ADR-020 (Current Position + Historical Transactions)**.

---

### Why UNIQUE on RawMaterialID?

Each raw material should have exactly one current stock record.

Example:

✔ Cement → One Stock Record

✔ Sand → One Stock Record

❌ Two Cement Stock Records

---

### Why DEFAULT 0?

When a raw material is first created,

its available quantity is naturally zero until purchases are recorded.

---

### Why DATE instead of TIMESTAMP?

Business users care about:

"When was stock updated?"

not necessarily

"At exactly what second?"

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

## Raw Material Stock Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (RawMaterialStock.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Inventory Business Logic

---

# 📘 Lesson Summary

Today you additionally learned:

- Difference between Current Position and Transaction Tables
- Why inventory should not store movement history
- One-to-One relationship using UNIQUE Foreign Key
- Using DEFAULT values for inventory initialization
- Designing inventory according to ERP best practices

---

## Architect Verdict

Excellent.

The Raw Material Stock table completes the inventory foundation for procurement.

It follows the **Current Position + Historical Transactions** model and is fully aligned with ADR-020, making it scalable, normalized, and ready for backend implementation.