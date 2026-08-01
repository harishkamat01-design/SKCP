# Table Review 05 — Asset

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Asset

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Asset table stores permanent factory asset information.

This is a **Master Data** table.

It acts as the parent for:

- Production
- Maintenance (Future)

Asset information should never be duplicated in transaction tables.

---

## Business Owner

Production Domain

---

## Table Type

Master Table

---

## Primary Key

AssetID

### Purpose

Uniquely identifies every factory asset.

No two assets can share the same AssetID.

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
-- Table : asset
-- Domain: Master Data
-- Purpose: Stores factory asset master information
-- ==========================================================

CREATE TABLE asset
(
    asset_id SERIAL PRIMARY KEY,

    asset_name VARCHAR(100) NOT NULL,

    asset_category VARCHAR(50) NOT NULL,

    manufacturer VARCHAR(100),

    model_number VARCHAR(100),

    serial_number VARCHAR(100),

    purchase_date DATE,

    installation_date DATE,

    location VARCHAR(100),

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','MAINTENANCE','OUT_OF_SERVICE')),

    last_maintenance_date DATE,

    next_maintenance_date DATE,

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
CREATE TABLE asset
```

### SQL Syntax

Creates a new table named **asset**.

### Database Concept

A table stores related records.

### SKCP Context

Stores all factory assets used in production.

---

## Line 2

```sql
asset_id SERIAL PRIMARY KEY
```

### SQL Syntax

- `SERIAL` automatically generates sequential IDs.
- `PRIMARY KEY` uniquely identifies each asset.

### Database Concept

Every table requires one unique identifier.

### SKCP Context

Each machine, mixer, generator, vehicle, pump, or equipment receives its own Asset ID.

Production records will reference this ID.

---

## Line 3

```sql
asset_name VARCHAR(100) NOT NULL
```

### SQL Syntax

Stores the asset name.

Maximum length: 100 characters.

`NOT NULL` makes it mandatory.

### Database Concept

Every asset must have a business name.

### SKCP Context

Examples:

- Vibro Machine
- Concrete Mixer
- Generator

---

## Line 4

```sql
asset_category VARCHAR(50) NOT NULL
```

### SQL Syntax

Stores the category of the asset.

### Database Concept

Grouping assets improves reporting and maintenance.

### SKCP Context

Examples:

- Block Machine
- Mixer
- Generator
- Vehicle
- Pump
- Water Tank
- CCTV

---

## Line 5

```sql
manufacturer VARCHAR(100)
```

### SQL Syntax

Stores manufacturer name.

Optional.

### Database Concept

Useful for maintenance and warranty.

### SKCP Context

Example:

- Bharat Engineering

---

## Line 6

```sql
model_number VARCHAR(100)
```

### SQL Syntax

Stores model number.

Optional.

### Database Concept

Helps uniquely identify equipment models.

### SKCP Context

Useful during servicing.

---

## Line 7

```sql
serial_number VARCHAR(100)
```

### SQL Syntax

Stores factory serial number.

Optional.

### Database Concept

Every manufactured machine usually has a unique serial number.

### SKCP Context

Useful for warranty and replacement.

---

## Line 8

```sql
purchase_date DATE
```

### SQL Syntax

Stores purchase date.

### Database Concept

Historical information.

### SKCP Context

Used for depreciation and asset history.

---

## Line 9

```sql
installation_date DATE
```

### SQL Syntax

Stores installation date.

### Database Concept

Purchase and installation may occur on different dates.

### SKCP Context

Useful for maintenance schedules.

---

## Line 10

```sql
location VARCHAR(100)
```

### SQL Syntax

Stores the physical location.

### Database Concept

Assets can be distributed across multiple locations.

### SKCP Context

Example:

- Production Area
- Raw Material Yard
- Office

---

## Line 11

```sql
status VARCHAR(20)
DEFAULT 'ACTIVE'
CHECK (...)
```

### SQL Syntax

Default:

ACTIVE

Allowed values:

- ACTIVE
- MAINTENANCE
- OUT_OF_SERVICE

### Database Concept

CHECK constraints protect the database.

### SKCP Context

Instead of deleting assets,

mark them appropriately.

Example:

Generator under repair

↓

Status = MAINTENANCE

---

## Line 12

```sql
last_maintenance_date DATE
```

### SQL Syntax

Stores the most recent maintenance date.

### Database Concept

Supports maintenance history.

### SKCP Context

Useful for future maintenance planning.

---

## Line 13

```sql
next_maintenance_date DATE
```

### SQL Syntax

Stores scheduled maintenance date.

### Database Concept

Supports preventive maintenance.

### SKCP Context

Future AI can generate maintenance reminders.

---

## Line 14

```sql
notes TEXT
```

### SQL Syntax

Stores additional remarks.

### Database Concept

Flexible business notes.

### SKCP Context

Examples:

- Motor replaced
- Gearbox repaired

---

## Line 15

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores creation date and time.

### Database Concept

Standard audit column.

### SKCP Context

Useful for:

- Reports
- Audits
- AI
- Asset history

---

# Step 4 — Architect Notes

### Why use snake_case?

Example:

asset_name

instead of

AssetName

Reason:

- PostgreSQL Best Practice
- Spring Boot JPA compatibility

---

### Why lowercase table names?

asset

instead of

Asset

Reason:

Avoid quoted identifiers and simplify SQL queries.

---

### Why SERIAL?

Version 1 uses SERIAL because it is simple and efficient.

Future enterprise systems may migrate to UUID.

---

### Why no foreign keys?

Asset is a Master Table.

It does not depend on any other table.

Instead,

Production will reference Asset.

Relationship:

Asset

↓

Production

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

## Asset Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Asset.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Future Foreign Key Relationships (Production)

---

# 📘 Lesson Summary

Today you additionally learned:

- How factory assets are modeled
- Why maintenance fields belong in Asset
- Why Production references Asset instead of storing machine details
- How designing for future maintenance improves long-term architecture

---

## Architect Verdict

Excellent.

The Master Data layer is now nearly complete.

Customer, Supplier, Product, Raw Material, Labour, and Asset establish a consistent, production-quality foundation for the entire SKCP ERP.