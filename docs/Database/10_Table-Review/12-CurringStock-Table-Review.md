# Table Review 12 — Curing Stock

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Curing Stock

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Curing Stock table stores cement blocks that have been produced but are still undergoing the curing process.

This is an **Inventory Current Position** table.

It acts as the temporary inventory stage between:

- Production
- Finished Goods Stock

It maintains only the **current curing batches**, while Production keeps the historical production records.

---

## Business Owner

Inventory Domain

---

## Table Type

Current Position Inventory Table

---

## Primary Key

CuringStockID

### Purpose

Uniquely identifies every curing batch.

Each production batch stored in the curing yard receives its own unique identifier.

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
-- Table : curing_stock
-- Domain: Inventory
-- Purpose: Stores current curing inventory batches
-- ==========================================================

CREATE TABLE curing_stock
(
    curing_stock_id SERIAL PRIMARY KEY,

    product_id INT NOT NULL,

    quantity INT NOT NULL
        CHECK (quantity >= 0),

    production_date DATE NOT NULL,

    expected_ready_date DATE NOT NULL,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'CURING'
        CHECK (status IN ('CURING', 'READY', 'MOVED')),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_curing_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE curing_stock
```

### SQL Syntax

Creates a new table named **curing_stock**.

### Database Concept

A table stores one type of business information.

### SKCP Context

Stores blocks that are currently curing.

---

## Line 2

```sql
curing_stock_id SERIAL PRIMARY KEY
```

### SQL Syntax

- SERIAL automatically generates batch IDs.
- PRIMARY KEY uniquely identifies every curing batch.

### Database Concept

Every table requires one unique identifier.

### SKCP Context

Each curing batch receives a unique ID.

---

## Line 3

```sql
product_id INT NOT NULL
```

### SQL Syntax

Stores the Product ID.

### Database Concept

Acts as a Foreign Key.

### SKCP Context

Identifies which block size is currently curing.

Example:

- 4-inch Block
- 6-inch Block
- 8-inch Block

---

## Line 4

```sql
quantity INT NOT NULL
CHECK (quantity >= 0)
```

### SQL Syntax

Stores the number of blocks.

CHECK prevents negative values.

### Database Concept

Inventory quantities cannot be negative.

### SKCP Context

Represents how many blocks are currently curing.

---

## Line 5

```sql
production_date DATE NOT NULL
```

### SQL Syntax

Stores the production date.

### Database Concept

Used to determine curing duration.

### SKCP Context

The date the blocks were manufactured.

---

## Line 6

```sql
expected_ready_date DATE NOT NULL
```

### SQL Syntax

Stores the planned completion date.

### Database Concept

Represents the expected curing completion.

### SKCP Context

Normally:

Production Date + 3 Days

The father decides when the blocks are actually ready.

---

## Line 7

```sql
status VARCHAR(10)
DEFAULT 'CURING'
CHECK (...)
```

### SQL Syntax

Default value:

CURING

Allowed values:

- CURING
- READY
- MOVED

### Database Concept

Restricts values using CHECK.

### SKCP Context

CURING

↓

READY

↓

MOVED TO FINISHED GOODS

---

## Line 8

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Allows flexible comments.

### SKCP Context

Examples:

- Heavy Rain
- Batch Delayed
- Minor Damage

---

## Line 9

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores creation date and time.

### Database Concept

Audit information.

### SKCP Context

Useful for:

- Inventory history
- Reports
- Debugging

---

## Line 10

```sql
FOREIGN KEY (product_id)
REFERENCES product(product_id)
```

### SQL Syntax

Creates a relationship with Product.

### Database Concept

Ensures only valid products can be stored.

### SKCP Context

Every curing batch must belong to one Product.

---

# Step 4 — Architect Notes

### Why separate Curing Stock from Production?

Production stores history.

Curing Stock stores only the current inventory under curing.

This follows the principle:

**Current Position + Historical Transactions**

---

### Why ExpectedReadyDate?

Allows future automation such as:

- Ready batch alerts
- AI production planning
- Inventory forecasting

---

### Why Status?

Instead of deleting rows immediately:

CURING

↓

READY

↓

MOVED

This preserves operational control until inventory transfer.

---

### Why no Labour or Asset reference?

Those belong to the Production table.

Curing Stock only manages inventory position.

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

## Curing Stock Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (CuringStock.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Future Inventory Transfer Logic

---

# 📘 Lesson Summary

Today you additionally learned:

- Difference between Historical Transactions and Current Position
- Why Curing Stock is an Inventory table instead of a Transaction table
- Why ExpectedReadyDate is stored
- Why Status controls inventory movement
- How Foreign Keys maintain inventory integrity

---

## Architect Verdict

Excellent.

The Curing Stock table perfectly implements the **Current Position + Historical Transactions** inventory philosophy established in the SKCP architecture.

It provides a clean bridge between Production History and Finished Goods Stock without duplicating business information.