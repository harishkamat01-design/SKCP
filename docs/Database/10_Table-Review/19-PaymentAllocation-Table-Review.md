# Table Review 19 — Payment Allocation

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Payment Allocation

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Payment Allocation table records how customer payments are distributed across customer orders.

This is a **Transaction Detail Table**.

It represents the business event:

**Payment allocated to one specific order.**

It belongs to:

- Payment

It references:

- Order

Each record represents **one allocation of money from one payment to one order.**

---

## Business Owner

Finance Domain

---

## Table Type

Transaction Detail Table

---

## Primary Key

PaymentAllocationID

### Purpose

Uniquely identifies every payment allocation.

---

## Foreign Keys

### PaymentID

References the parent Payment.

Relationship:

Payment

↓

Payment Allocation

---

### OrderID

References the Order table.

Relationship:

Order

↓

Payment Allocation

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
-- Table : payment_allocation
-- Domain: Finance
-- Purpose: Stores payment allocation against customer orders
-- ==========================================================

CREATE TABLE payment_allocation
(
    payment_allocation_id SERIAL PRIMARY KEY,

    payment_id INT NOT NULL,

    order_id INT NOT NULL,

    allocated_amount DECIMAL(12,2)
        NOT NULL
        CHECK (allocated_amount > 0),

    allocation_date DATE NOT NULL,

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_paymentallocation_payment
        FOREIGN KEY (payment_id)
        REFERENCES payment(payment_id),

    CONSTRAINT fk_paymentallocation_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE payment_allocation
```

### SQL Syntax

Creates a table named **payment_allocation**.

### Database Concept

Stores detailed allocation records.

### SKCP Context

Stores how customer payments are distributed across orders.

---

## Line 2

```sql
payment_allocation_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates a unique Allocation ID.

### Database Concept

Every allocation record requires a unique identifier.

### SKCP Context

Each allocation receives its own ID.

---

## Line 3

```sql
payment_id INT NOT NULL
```

### SQL Syntax

Stores Payment ID.

### Database Concept

Foreign Key reference.

### SKCP Context

Every allocation belongs to one payment.

Relationship:

Payment

↓

Payment Allocation

---

### Foreign Key

```sql
FOREIGN KEY (payment_id)
REFERENCES payment(payment_id)
```

### SQL Syntax

Links Allocation to Payment.

### Database Concept

Ensures allocations cannot exist without a payment.

### SKCP Context

Money must first be received before it can be allocated.

---

## Line 4

```sql
order_id INT NOT NULL
```

### SQL Syntax

Stores Order ID.

### Database Concept

Foreign Key reference.

### SKCP Context

Identifies which customer order receives the payment.

---

### Foreign Key

```sql
FOREIGN KEY (order_id)
REFERENCES orders(order_id)
```

### SQL Syntax

Links Allocation to Order.

### Database Concept

Maintains Referential Integrity.

### SKCP Context

Only valid customer orders can receive payment allocations.

---

## Line 5

```sql
allocated_amount DECIMAL(12,2)
```

### SQL Syntax

Stores the allocated payment amount.

CHECK prevents zero or negative values.

### Database Concept

Financial values require precision.

### SKCP Context

Example:

Payment Received:

₹20,000

Allocated:

Order A → ₹8,000

Order B → ₹12,000

---

## Line 6

```sql
allocation_date DATE NOT NULL
```

### SQL Syntax

Stores the allocation date.

### Database Concept

Every financial allocation has a transaction date.

### SKCP Context

Useful for audit and reconciliation.

---

## Line 7

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Flexible business information.

### SKCP Context

Examples:

Advance adjusted

Remaining balance cleared

Manual correction

---

## Line 8

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

- Audit
- Reports
- AI
- Debugging

---

# Step 4 — Architect Notes

### Why create Payment Allocation?

Without this table:

One payment could only belong to one order.

Real businesses don't work like that.

Example:

Customer owes:

Order 101 → ₹10,000

Order 102 → ₹5,000

Customer pays:

₹15,000

One payment settles both orders.

---

### Why not store OrderID in Payment?

That would prevent one payment from paying multiple orders.

The bridge table solves this problem cleanly.

---

### Why is this a Many-to-Many relationship?

One Payment

↓

Many Orders

One Order

↓

Many Payments

Payment Allocation acts as the bridge.

---

### Why store Allocation Date?

Sometimes payment is received today but allocated later.

Keeping allocation history improves auditing.

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

## Payment Allocation Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (PaymentAllocation.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Foreign Key relationships with Payment and Order

---

# 📘 Lesson Summary

Today you learned:

- What a bridge table is
- Why Many-to-Many relationships require an intermediate table
- Difference between Payment and Payment Allocation
- How ERP systems track partial payments
- Why financial allocation history is important
- Enterprise-level financial database design

---

## Architect Verdict

Excellent.

The **Payment Allocation** table completes the Finance module and finalizes the Version 1 relational database architecture.

The complete financial flow is now:

Customer

↓

Order

↓

Payment

↓

Payment Allocation

This is the same accounting architecture used in enterprise ERP systems like SAP, Oracle ERP, Microsoft Dynamics, and Odoo.