# Table Review 04 — RawMaterial

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

RawMaterial

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The RawMaterial table stores permanent information about all raw materials used in cement block manufacturing.

This is a **Master Data** table.

It acts as the parent for:

- PurchaseItem
- ProductionItem

Raw material information should never be duplicated in transaction tables.

---

## Business Owner

Procurement Domain

---

## Table Type

Master Table

---

## Primary Key

RawMaterialID

### Purpose

Uniquely identifies every raw material.

No two raw materials can share the same RawMaterialID.

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
-- Table : raw_material
-- Domain: Master Data / Procurement
-- Purpose: Stores raw material master information
-- ==========================================================

CREATE TABLE raw_material
(
    raw_material_id SERIAL PRIMARY KEY,

    material_name VARCHAR(100) NOT NULL,

    material_category VARCHAR(50) NOT NULL,

    description TEXT,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE raw_material
```

### SQL Syntax

Creates a new table named **raw_material**.

### Database Concept

A table stores records of a single business entity.

### SKCP Context

Stores all raw materials used for manufacturing cement blocks.

---

## Line 2

```sql
raw_material_id SERIAL PRIMARY KEY
```

### SQL Syntax

- `SERIAL` automatically generates sequential IDs.
- `PRIMARY KEY` uniquely identifies every raw material.

### Database Concept

Every table requires one unique identifier.

### SKCP Context

Each raw material receives its own ID.

Example:

```
1 → Cement
2 → Sand
3 → Fly Ash
4 → Jelly
5 → Water
```

PurchaseItem and ProductionItem will reference this ID.

---

## Line 3

```sql
material_name VARCHAR(100) NOT NULL
```

### SQL Syntax

Stores the material name.

Maximum length: 100 characters.

Mandatory field.

### Database Concept

A raw material cannot exist without a name.

### SKCP Context

Examples:

- Cement
- Sand
- Fly Ash
- Jelly
- Water

---

## Line 4

```sql
material_category VARCHAR(50) NOT NULL
```

### SQL Syntax

Stores the category of the material.

Mandatory field.

### Database Concept

Categories help organize materials.

### SKCP Context

Examples:

- Cement
- Sand
- Aggregate
- Water
- Chemical
- Additive

Useful for inventory reports and purchase analysis.

---

## Line 5

```sql
description TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

TEXT is used because descriptions vary in length.

### SKCP Context

Examples:

- OPC 53 Grade Cement
- River Sand
- 20 mm Jelly
- Potable Water

---

## Line 6

```sql
status VARCHAR(10)
NOT NULL
DEFAULT 'ACTIVE'
CHECK (status IN ('ACTIVE','INACTIVE'))
```

### SQL Syntax

Default value:

ACTIVE

Allowed values:

- ACTIVE
- INACTIVE

### Database Concept

CHECK constraints protect the database from invalid values.

### SKCP Context

If a material is no longer purchased,

it should be marked as **INACTIVE** rather than deleted.

Historical Purchase records remain valid.

---

## Line 7

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores the creation date and time.

### Database Concept

Audit columns are essential in production databases.

### SKCP Context

Useful for:

- Material history
- Reports
- Audit
- AI analysis
- Debugging

---

# Step 4 — Architect Notes

### Why use snake_case?

Example:

```
material_name
```

instead of

```
MaterialName
```

Reason:

- PostgreSQL Best Practice
- Spring Boot JPA compatibility

---

### Why use lowercase table names?

```
raw_material
```

instead of

```
RawMaterial
```

Reason:

Avoid quoted identifiers and simplify SQL queries.

---

### Why use SERIAL?

Version 1 uses SERIAL because it is simple, efficient, and ideal for PostgreSQL.

Future enterprise systems may migrate to UUIDs if required.

---

### Why no foreign keys?

RawMaterial is a Master Table.

It does not depend on any other table.

Instead,

PurchaseItem and ProductionItem will reference RawMaterial.

Relationship:

```
RawMaterial

↓

PurchaseItem

↓

ProductionItem
```

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

## RawMaterial Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (`RawMaterial.java`)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Future Foreign Key Relationships (PurchaseItem, ProductionItem)

---

# 📘 Lesson Summary

Today you additionally learned:

- Why raw materials are modeled as Master Data.
- Why material categories improve reporting and analysis.
- Why PurchaseItem and ProductionItem reference RawMaterial instead of storing material details.
- How a Master Table supports multiple business processes without data duplication.

---

## Architect Verdict

Excellent.

Customer, Supplier, Product, and RawMaterial now establish a consistent and production-ready **Master Data architecture** for SKCP.

The remaining Master Tables:

- Labour
- Asset

will follow exactly the same architectural standard.