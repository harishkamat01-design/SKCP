# Table Review 07 — Purchase

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Purchase

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Purchase table stores every raw material purchase transaction made from suppliers.

This is a **Transaction Table**.

It acts as the parent for:

- PurchaseItem

It acts as the child of:

- Supplier

Purchase records represent actual business events and should never store duplicated supplier information.

---

## Business Owner

Procurement Domain

---

## Table Type

Transaction Table

---

## Primary Key

PurchaseID

### Purpose

Uniquely identifies every purchase transaction.

No two purchases can share the same PurchaseID.

---

## Foreign Key

SupplierID

### Purpose

Identifies which supplier supplied the raw materials.

Every Purchase must belong to exactly one Supplier.

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
-- Table : purchase
-- Domain: Procurement
-- Purpose: Stores purchase transactions from suppliers
-- ==========================================================

CREATE TABLE purchase
(
    purchase_id SERIAL PRIMARY KEY,

    supplier_id INT NOT NULL,

    purchase_date DATE NOT NULL,

    invoice_number VARCHAR(50),

    total_amount DECIMAL(12,2) NOT NULL,

    payment_status VARCHAR(10)
        NOT NULL
        DEFAULT 'PENDING'
        CHECK (payment_status IN ('PENDING','PARTIAL','PAID')),

    remarks TEXT,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','CANCELLED')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchase_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES supplier(supplier_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE purchase
```

### SQL Syntax

Creates a new table named **purchase**.

### Database Concept

A table stores related records.

### SKCP Context

Stores every raw material purchase transaction.

---

## Line 2

```sql
purchase_id SERIAL PRIMARY KEY
```

### SQL Syntax

- `SERIAL` generates sequential IDs.
- `PRIMARY KEY` uniquely identifies each purchase.

### Database Concept

Every transaction requires a unique identifier.

### SKCP Context

Each purchase made from a supplier receives its own Purchase ID.

---

## Line 3

```sql
supplier_id INT NOT NULL
```

### SQL Syntax

Stores the Supplier ID.

Mandatory.

### Database Concept

This is a **Foreign Key** column.

It links the Purchase table to the Supplier table.

### SKCP Context

Every purchase must come from an existing supplier.

---

## Line 4

```sql
purchase_date DATE NOT NULL
```

### SQL Syntax

Stores the purchase date.

### Database Concept

Represents the actual business event date.

### SKCP Context

The date on which raw materials were purchased.

---

## Line 5

```sql
invoice_number VARCHAR(50)
```

### SQL Syntax

Stores supplier invoice number.

Optional.

### Database Concept

Useful for traceability.

### SKCP Context

Helps verify supplier bills later.

---

## Line 6

```sql
total_amount DECIMAL(12,2) NOT NULL
```

### SQL Syntax

Stores purchase amount.

Example:

12500.50

### Database Concept

`DECIMAL` preserves financial accuracy.

### SKCP Context

Stores total purchase value.

---

## Line 7

```sql
payment_status VARCHAR(10)
DEFAULT 'PENDING'
CHECK (...)
```

### SQL Syntax

Default:

PENDING

Allowed values:

- PENDING
- PARTIAL
- PAID

### Database Concept

Restricts invalid values.

### SKCP Context

Tracks supplier payment status.

---

## Line 8

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Flexible descriptive field.

### SKCP Context

Examples:

- Urgent Purchase
- Cash Payment
- Credit Purchase

---

## Line 9

```sql
status VARCHAR(10)
DEFAULT 'ACTIVE'
CHECK (...)
```

### SQL Syntax

Default:

ACTIVE

Allowed values:

- ACTIVE
- CANCELLED

### Database Concept

Logical deletion.

### SKCP Context

Cancelled purchases remain for audit purposes.

---

## Line 10

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores creation date and time.

### Database Concept

Audit column.

### SKCP Context

Useful for:

- Reports
- Audit
- AI
- Debugging

---

## Line 11

```sql
CONSTRAINT fk_purchase_supplier
FOREIGN KEY (supplier_id)
REFERENCES supplier(supplier_id)
```

### SQL Syntax

Creates a Foreign Key relationship.

### Database Concept

Enforces **Referential Integrity**.

A Purchase cannot exist without a valid Supplier.

### SKCP Context

If Supplier 5 does not exist,

PostgreSQL will reject:

```sql
INSERT INTO purchase (supplier_id)
VALUES (5);
```

This protects data quality.

---

# Step 4 — Architect Notes

### Why is Purchase a Transaction Table?

Purchase represents a business event.

It records:

- When materials were purchased
- From whom
- How much was paid

---

### Why use Foreign Keys?

Instead of storing:

Supplier Name

Supplier Phone

Supplier Address

inside Purchase,

we simply store:

SupplierID

The database retrieves supplier details whenever needed.

This eliminates duplication.

---

### Parent–Child Relationship

```text
Supplier
      │
      ▼
Purchase
```

One Supplier

↓

Many Purchases

This is a **One-to-Many Relationship**.

---

### Why Referential Integrity?

Without Foreign Keys,

someone could accidentally create a purchase for a supplier that doesn't exist.

Foreign Keys prevent invalid business data.

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

## Purchase Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Purchase.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Foreign Key Relationship with Supplier
- ✅ Parent Table for PurchaseItem

---

# 📘 Lesson Summary

Today you additionally learned:

- Transaction Tables
- Foreign Keys
- Referential Integrity
- One-to-Many Relationships
- Why transaction tables reference master tables
- Why duplicated business information is avoided

---

## Architect Verdict

Excellent.

This is the **first Transaction Table** in SKCP and introduces one of the most important concepts in relational databases—**Foreign Keys**.

From this point onward, almost every remaining transaction table will follow this same architectural pattern.