# Table Review 09 — Production

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Production

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Production table stores every production batch manufactured in the factory.

This is a **Transaction Table**.

It records:

- Daily production
- Product manufactured
- Quantity produced
- Cement consumption
- Machine (Asset) used
- Production status

It acts as the parent for:

- ProductionItem (Raw Material Consumption)

---

## Business Owner

Production Domain

---

## Table Type

Transaction Table

---

## Primary Key

ProductionID

### Purpose

Uniquely identifies every production batch.

No two production batches can share the same ProductionID.

---

## Foreign Keys

| Foreign Key | References |
|-------------|------------|
| ProductID | Product |
| AssetID | Asset |

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
-- Table : production
-- Domain: Production
-- Purpose: Stores daily production batch information
-- ==========================================================

CREATE TABLE production
(
    production_id SERIAL PRIMARY KEY,

    production_date DATE NOT NULL,

    product_id INT NOT NULL,

    quantity_produced INT NOT NULL CHECK (quantity_produced > 0),

    morning_cement_bags DECIMAL(5,2)
        NOT NULL
        DEFAULT 0
        CHECK (morning_cement_bags >= 0),

    afternoon_cement_bags DECIMAL(5,2)
        NOT NULL
        DEFAULT 0
        CHECK (afternoon_cement_bags >= 0),

    total_cement_bags DECIMAL(5,2)
        GENERATED ALWAYS AS
        (morning_cement_bags + afternoon_cement_bags)
        STORED,

    notes TEXT,

    status VARCHAR(15)
        NOT NULL
        DEFAULT 'COMPLETED'
        CHECK (status IN ('COMPLETED','CANCELLED')),

    asset_id INT NOT NULL,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_production_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id),

    CONSTRAINT fk_production_asset
        FOREIGN KEY (asset_id)
        REFERENCES asset(asset_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE production
```

### SQL Syntax

Creates a table named **production**.

### Database Concept

Stores one production batch per row.

### SKCP Context

Every day's manufacturing becomes one Production record.

---

## Line 2

```sql
production_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates Production IDs.

### Database Concept

Primary Key uniquely identifies every production batch.

### SKCP Context

Example

Production 1

31-Jul-2026

Morning Shift

Production 2

31-Jul-2026

Afternoon Shift

---

## Line 3

```sql
production_date DATE NOT NULL
```

### SQL Syntax

Stores the production date.

### Database Concept

Every production batch must belong to a date.

### SKCP Context

Used for:

- Daily Production Reports
- Monthly Reports
- AI Forecasting

---

## Line 4

```sql
product_id INT NOT NULL
```

### SQL Syntax

Foreign Key reference.

### Database Concept

Links Production to Product.

### SKCP Context

Specifies which block size was manufactured.

Example

4"

6"

8"

---

## Line 5

```sql
quantity_produced INT NOT NULL
CHECK (quantity_produced > 0)
```

### SQL Syntax

Stores produced quantity.

CHECK ensures it must be greater than zero.

### Database Concept

Negative production is impossible.

### SKCP Context

Example

500 blocks

1000 blocks

---

## Line 6

```sql
morning_cement_bags DECIMAL(5,2)
```

### SQL Syntax

Stores cement bags consumed during morning production.

### Database Concept

Separate tracking improves consumption analysis.

### SKCP Context

9:00 AM – 1:00 PM production.

---

## Line 7

```sql
afternoon_cement_bags DECIMAL(5,2)
```

### SQL Syntax

Stores afternoon cement usage.

### Database Concept

Supports shift-wise reporting.

### SKCP Context

2:30 PM – 5:30 PM production.

---

## Line 8

```sql
total_cement_bags
GENERATED ALWAYS AS
(morning_cement_bags + afternoon_cement_bags)
STORED
```

### SQL Syntax

PostgreSQL Generated Column.

Automatically calculates:

Morning + Afternoon

### Database Concept

Avoids duplicate calculations.

Database always keeps the value correct.

### SKCP Context

Father never needs to calculate manually.

---

## Line 9

```sql
notes TEXT
```

### SQL Syntax

Stores remarks.

### Database Concept

Optional field.

### SKCP Context

Examples

Rain

Machine breakdown

Power failure

Mould changed

---

## Line 10

```sql
status
DEFAULT 'COMPLETED'
```

### SQL Syntax

Allowed values

COMPLETED

CANCELLED

### Database Concept

Protects production integrity.

### SKCP Context

Cancelled batches remain in history.

---

## Line 11

```sql
asset_id INT NOT NULL
```

### SQL Syntax

Foreign Key.

### Database Concept

Links Production to Asset.

### SKCP Context

Records which machine produced the blocks.

Supports

- Machine utilization
- Maintenance analysis
- AI recommendations

---

## Line 12

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Stores creation timestamp automatically.

### Database Concept

Audit column.

### SKCP Context

Useful for

- Reports
- Debugging
- Historical analysis

---

## Foreign Keys

### Product

```sql
FOREIGN KEY (product_id)
REFERENCES product(product_id)
```

Links Production to Product.

---

### Asset

```sql
FOREIGN KEY (asset_id)
REFERENCES asset(asset_id)
```

Links Production to Machine.

---

# Step 4 — Architect Notes

### Why is Production a Transaction Table?

Because production happens every day.

It records a business event.

---

### Why Generated Column?

Instead of storing

Morning = 12

Afternoon = 10

Total = 25 ❌ (Wrong)

The database calculates:

12 + 10 = 22

Automatically.

---

### Why AssetID?

ADR-021 approved this decision.

Future benefits:

- Machine-wise reports
- Utilization
- Maintenance
- AI Insights

---

### Why ProductID instead of Product Name?

Normalization.

Product Name belongs only in Product table.

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

## Production Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Production.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Foreign Key Relationships
- ✅ Production Reports

---

# 📘 Lesson Summary

Today you additionally learned:

- Transaction Tables
- Generated Columns
- CHECK Constraints
- Foreign Keys
- Why calculated values should not be manually stored
- How Production references Product and Asset
- Why Transaction tables represent business events

---

## Architect Verdict

Excellent.

Production is the **heart of the manufacturing module**.

This table accurately captures the real factory workflow and establishes the foundation for inventory updates, raw material consumption, machine utilization, and future AI-driven production analytics.