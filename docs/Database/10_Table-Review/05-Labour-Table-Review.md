# Table Review 05 — Labour

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Labour

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Labour table stores permanent information about workers employed in the factory.

This is a **Master Data** table.

It acts as the parent for:

- Attendance
- Weekly Salary Calculation
- Future Production Assignment

Labour information should never be duplicated in transaction tables.

---

## Business Owner

Production Domain

---

## Table Type

Master Table

---

## Primary Key

LabourID

### Purpose

Uniquely identifies every labour.

No two labour records can share the same LabourID.

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
CREATE TABLE labour
(
    labour_id SERIAL PRIMARY KEY,

    labour_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    address TEXT,

    joining_date DATE NOT NULL,

    skill_type VARCHAR(50) NOT NULL,

    daily_rate DECIMAL(10,2)
        NOT NULL
        CHECK (daily_rate >= 0),

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
CREATE TABLE labour
```

### SQL Syntax

Creates a new table named **labour**.

### Database Concept

A table stores related records.

### SKCP Context

Stores permanent worker information.

---

## Line 2

```sql
labour_id SERIAL PRIMARY KEY
```

### SQL Syntax

- `SERIAL` automatically generates sequential IDs.
- `PRIMARY KEY` uniquely identifies each labour.

### Database Concept

Every table requires one unique identifier.

### SKCP Context

Each worker receives a unique Labour ID.

Attendance and future salary records will reference this ID.

---

## Line 3

```sql
labour_name VARCHAR(100) NOT NULL
```

### SQL Syntax

Stores worker name.

Maximum length: 100 characters.

`NOT NULL` means the value is mandatory.

### Database Concept

A labour record cannot exist without a name.

### SKCP Context

Your father identifies workers by name during daily attendance.

---

## Line 4

```sql
phone VARCHAR(20) NOT NULL
```

### SQL Syntax

Stores mobile number.

### Database Concept

Phone numbers are identifiers, not numbers.

Therefore `VARCHAR` is used.

### SKCP Context

Required for contacting workers.

---

## Line 5

```sql
address TEXT
```

### SQL Syntax

Stores long text.

### Database Concept

Addresses vary in length.

TEXT is ideal.

### SKCP Context

Stores residential address.

---

## Line 6

```sql
joining_date DATE NOT NULL
```

### SQL Syntax

Stores the date the worker joined.

### Database Concept

Useful for employee history.

### SKCP Context

Can later support experience tracking and reports.

---

## Line 7

```sql
skill_type VARCHAR(50) NOT NULL
```

### SQL Syntax

Stores labour role.

Examples:

- Machine Operator
- Mixer
- Loader
- Helper

### Database Concept

Stores business classification.

### SKCP Context

Useful for workforce planning.

---

## Line 8

```sql
daily_rate DECIMAL(10,2)
NOT NULL
CHECK (daily_rate >= 0)
```

### SQL Syntax

Stores the standard daily wage.

Example:

400.00

### Database Concept

DECIMAL stores currency accurately.

CHECK prevents negative salary values.

### SKCP Context

Weekly salary will be calculated using:

Attendance × Daily Rate

---

## Line 9

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

CHECK constraint protects data integrity.

### SKCP Context

Workers leaving the company are marked INACTIVE instead of deleting records.

Historical attendance remains intact.

---

## Line 10

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores record creation date and time.

### Database Concept

Audit information is important.

### SKCP Context

Useful for:

- Reports
- Audits
- AI
- Record history

---

# Step 4 — Architect Notes

### Why use snake_case?

Example:

labour_name

instead of

LabourName

Reason:

- PostgreSQL Best Practice
- Spring Boot JPA compatibility

---

### Why use lowercase table names?

labour

instead of

Labour

Reason:

Avoid quoted identifiers and simplify SQL queries.

---

### Why SERIAL?

Version 1 uses SERIAL because it is simple, efficient, and ideal for PostgreSQL.

Future enterprise systems may use UUIDs.

---

### Why use DECIMAL for salary?

Money should never use FLOAT.

DECIMAL provides exact precision for financial calculations.

---

### Why no foreign keys?

Labour is a Master Table.

It does not depend on any other table.

Instead,

Attendance will reference Labour.

Relationship:

Labour

↓

Attendance

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

## Labour Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Labour.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Future Foreign Key Relationships (Attendance)

    ---

# 📘 Lesson Summary

Today you additionally learned:

- Why labour information belongs in a Master Table
- Why salary uses DECIMAL instead of FLOAT
- How CHECK constraints enforce business rules
- Why Attendance should reference Labour instead of storing worker details repeatedly

---

## Architect Verdict

Excellent.

Customer, Supplier, Product, Raw Material, and Labour now establish a consistent Master Data architecture for SKCP.

The remaining Master Table:

- Asset

will follow exactly the same architectural pattern.