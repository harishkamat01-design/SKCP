# Table Review 02 — Supplier

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Supplier

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Supplier table stores permanent supplier master information.

This is a **Master Data** table.

It acts as the parent for:

- Purchase
- Raw Material Procurement

Supplier information should never be duplicated in transaction tables.

---

## Business Owner

Procurement Domain

---

## Table Type

Master Table

---

## Primary Key

SupplierID

### Purpose

Uniquely identifies every supplier.

No two suppliers can share the same SupplierID.

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
CREATE TABLE supplier
(
    supplier_id SERIAL PRIMARY KEY,

    supplier_name VARCHAR(100) NOT NULL,

    contact_person VARCHAR(100),

    phone VARCHAR(20) NOT NULL,

    whatsapp VARCHAR(20),

    address TEXT,

    gst_number VARCHAR(30),

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
CREATE TABLE supplier
```

### SQL Syntax

Creates a new table named **supplier**.

### Database Concept

A table stores related records.

### SKCP Context

Stores permanent supplier information.

---

## Line 2

```sql
supplier_id SERIAL PRIMARY KEY
```

### SQL Syntax

- `SERIAL` automatically generates sequential IDs.
- `PRIMARY KEY` uniquely identifies each supplier.

### Database Concept

Every table needs one unique identifier.

### SKCP Context

Each supplier receives a unique Supplier ID.

Purchase records will reference this ID.

---

## Line 3

```sql
supplier_name VARCHAR(100) NOT NULL
```

### SQL Syntax

Stores supplier name.

Maximum length: 100 characters.

`NOT NULL` means the value is mandatory.

### Database Concept

A supplier cannot exist without a name.

### SKCP Context

Your father always identifies suppliers by their business name.

---

## Line 4

```sql
contact_person VARCHAR(100)
```

### SQL Syntax

Optional field.

### Database Concept

Not every supplier has a dedicated contact person.

### SKCP Context

Some suppliers deal directly with the owner.

---

## Line 5

```sql
phone VARCHAR(20) NOT NULL
```

### SQL Syntax

Stores supplier contact number.

### Database Concept

Phone numbers are identifiers, not numbers.

Hence `VARCHAR`, not `INTEGER`.

### SKCP Context

Communication with suppliers is mandatory.

---

## Line 6

```sql
whatsapp VARCHAR(20)
```

### SQL Syntax

Optional WhatsApp number.

### Database Concept

Some suppliers communicate through WhatsApp.

### SKCP Context

Useful for sending purchase confirmations or enquiries.

---

## Line 7

```sql
address TEXT
```

### SQL Syntax

Stores long text.

### Database Concept

Addresses vary in length.

TEXT is ideal.

### SKCP Context

Useful for supplier reference.

---

## Line 8

```sql
gst_number VARCHAR(30)
```

### SQL Syntax

Stores GST registration.

Optional field.

### Database Concept

Not every supplier may have GST registration.

### SKCP Context

Required for GST purchases.

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

The CHECK constraint protects the database.

Invalid values cannot be stored.

### SKCP Context

Instead of deleting suppliers,

mark them as INACTIVE.

Historical purchase records remain intact.

---

## Line 10

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores the date and time when the supplier record is created.

### Database Concept

Audit information is important in every production database.

### SKCP Context

Useful for:

- Supplier history
- Reports
- Audit
- AI analysis
- Debugging

---

# Step 4 — Architect Notes

### Why use snake_case?

Example:

supplier_name

instead of

SupplierName

Reason:

- PostgreSQL Best Practice
- Spring Boot JPA compatibility

---

### Why use lowercase table names?

supplier

instead of

Supplier

Reason:

Avoid quoted identifiers and simplify SQL queries.

---

### Why SERIAL?

Version 1 uses SERIAL because it is simple, efficient, and ideal for PostgreSQL.

Future enterprise systems may use UUIDs.

---

### Why no foreign keys?

Supplier is a Master Table.

It does not depend on any other table.

Instead,

Purchase will reference Supplier.

Relationship:

Supplier

↓

Purchase

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

## Supplier Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Supplier.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Future Foreign Key Relationships (Purchase)

---

# 📘 Lesson Summary

Today you additionally learned:

- How to design another Master Table
- Why Supplier contains only supplier information
- Why Purchase references Supplier instead of storing supplier details
- How Master Data remains separated from Transaction Data

---

## Architect Verdict

Excellent.

Customer and Supplier now establish the standard template for every Master Data table in SKCP.

The remaining Master Tables:

- Product
- Raw Material
- Labour
- Asset

will follow exactly the same architectural pattern.