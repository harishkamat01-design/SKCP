# Table Review 14 — Order

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Order

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Order table stores the header information for every customer order.

This is a **Transaction Table**.

It represents the business event:

**Customer places an order.**

It acts as the parent for:

- Order Item
- Delivery
- Payment Allocation (Indirectly)

The Order table stores only order-level information.

Product details are stored separately in **Order Item**.

---

## Business Owner

Sales Domain

---

## Table Type

Transaction Table

---

## Primary Key

OrderID

### Purpose

Uniquely identifies every customer order.

No two orders can share the same OrderID.

---

## Foreign Key

CustomerID

### Purpose

Identifies which customer placed the order.

Relationship:

Customer

↓

Order

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
-- Table : orders
-- Domain: Sales
-- Purpose: Stores customer order header information
-- ==========================================================

CREATE TABLE orders
(
    order_id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,

    order_date DATE NOT NULL,

    expected_delivery_date DATE,

    order_status VARCHAR(15)
        NOT NULL
        DEFAULT 'PENDING'
        CHECK (order_status IN
        (
            'PENDING',
            'PARTIAL',
            'COMPLETED',
            'CANCELLED'
        )),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE orders
```

### SQL Syntax

Creates a new table named **orders**.

### Database Concept

A table stores one category of business records.

### SKCP Context

Stores every customer order placed in the business.

---

## Line 2

```sql
order_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates a unique Order ID.

### Database Concept

Primary Key uniquely identifies every order.

### SKCP Context

Each customer order receives its own Order ID.

Example:

Order 101

Order 102

Order 103

---

## Line 3

```sql
customer_id INT NOT NULL
```

### SQL Syntax

Stores the Customer ID.

### Database Concept

This is a Foreign Key reference.

### SKCP Context

Every order belongs to one customer.

Relationship:

Customer

↓

Order

---

## Foreign Key

```sql
FOREIGN KEY (customer_id)
REFERENCES customer(customer_id)
```

### SQL Syntax

Links the Order table to the Customer table.

### Database Concept

Enforces Referential Integrity.

An order cannot exist for a customer that doesn't exist.

### SKCP Context

Prevents accidental orders for unknown customers.

---

## Line 4

```sql
order_date DATE NOT NULL
```

### SQL Syntax

Stores the order creation date.

### Database Concept

Every transaction should record when it occurred.

### SKCP Context

Used for:

- Daily Sales
- Monthly Reports
- Yearly Reports

---

## Line 5

```sql
expected_delivery_date DATE
```

### SQL Syntax

Stores the planned delivery date.

### Database Concept

Optional business planning field.

### SKCP Context

Helps schedule deliveries.

---

## Line 6

```sql
order_status
```

Allowed values:

- PENDING
- PARTIAL
- COMPLETED
- CANCELLED

### SQL Syntax

Uses CHECK constraint.

### Database Concept

Restricts data to valid business values.

### SKCP Context

Tracks the order lifecycle.

---

## Line 7

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Allows flexible business comments.

### SKCP Context

Examples:

Urgent delivery

Customer requested morning delivery

Special packing

---

## Line 8

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores record creation date and time.

### Database Concept

Provides audit information.

### SKCP Context

Useful for:

- Reports
- History
- AI
- Debugging

---

# Step 4 — Architect Notes

### Why is this called Order Header?

This table stores only order-level information.

Example:

Customer

↓

Order Date

↓

Delivery Date

↓

Status

Product information is stored separately.

---

### Why not store products here?

One order can contain many products.

Therefore:

Order

↓

Order Item

This keeps the database normalized.

---

### Why Foreign Key?

Every order belongs to one customer.

The database guarantees the customer exists.

---

### Why Transaction Table?

Unlike Customer or Product,

orders happen over time.

They represent business events.

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

## Order Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Order.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Foreign Key relationships with Customer and Order Item

---

# 📘 Lesson Summary

Today you learned:

- What a Transaction Table is
- Why Order stores only header information
- Why products are separated into Order Item
- How Foreign Keys enforce business relationships
- Why Order represents a business event
- How Order becomes the parent for Order Item

---

## Architect Verdict

Excellent.

The **Order** table is the first major **Sales Transaction Table** in SKCP.

It demonstrates the separation between:

Master Data

↓

Business Transactions

↓

Transaction Details

This architecture mirrors how professional ERP systems are designed.