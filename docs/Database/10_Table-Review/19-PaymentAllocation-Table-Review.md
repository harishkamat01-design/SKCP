# Table Review 19 — Payment

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Payment

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Payment table stores every payment received from customers.

This is a **Transaction Header Table**.

It represents the business event:

**Customer made a payment.**

It acts as the parent for:

- Payment Allocation

It references:

- Customer

The Payment table stores only payment-level information.

Which orders are settled by this payment will be recorded in **Payment Allocation**.

---

## Business Owner

Finance Domain

---

## Table Type

Transaction Header Table

---

## Primary Key

PaymentID

### Purpose

Uniquely identifies every payment transaction.

---

## Foreign Key

### CustomerID

References the Customer table.

Relationship:

Customer

↓

Payment

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
-- Table : payment
-- Domain: Finance
-- Purpose: Stores customer payment transactions
-- ==========================================================

CREATE TABLE payment
(
    payment_id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,

    payment_date DATE NOT NULL,

    total_amount_received DECIMAL(12,2)
        NOT NULL
        CHECK (total_amount_received > 0),

    payment_mode VARCHAR(20)
        NOT NULL
        CHECK
        (
            payment_mode IN
            (
                'CASH',
                'UPI',
                'BANK_TRANSFER',
                'CHEQUE'
            )
        ),

    reference_number VARCHAR(100),

    received_by VARCHAR(100) NOT NULL,

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE payment
```

### SQL Syntax

Creates a table named **payment**.

### Database Concept

Stores payment transactions.

### SKCP Context

Stores every payment received from customers.

---

## Line 2

```sql
payment_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates a unique Payment ID.

### Database Concept

Every payment transaction requires a unique identifier.

### SKCP Context

Each payment receives its own Payment ID.

---

## Line 3

```sql
customer_id INT NOT NULL
```

### SQL Syntax

Stores Customer ID.

### Database Concept

Foreign Key reference.

### SKCP Context

Every payment belongs to one customer.

Relationship:

Customer

↓

Payment

---

### Foreign Key

```sql
FOREIGN KEY (customer_id)
REFERENCES customer(customer_id)
```

### SQL Syntax

Links Payment to Customer.

### Database Concept

Maintains Referential Integrity.

### SKCP Context

Only existing customers can make payments.

---

## Line 4

```sql
payment_date DATE NOT NULL
```

### SQL Syntax

Stores the payment date.

### Database Concept

Every financial transaction has a business date.

### SKCP Context

Used for:

- Daily collection reports
- Monthly reports
- Financial audit

---

## Line 5

```sql
total_amount_received DECIMAL(12,2)
```

### SQL Syntax

Stores the payment amount.

CHECK prevents zero or negative values.

### Database Concept

Financial values require precision.

### SKCP Context

Example:

₹15,000

₹2,500

₹45,000

---

## Line 6

```sql
payment_mode
```

Allowed values:

- CASH
- UPI
- BANK_TRANSFER
- CHEQUE

### SQL Syntax

Uses CHECK constraint.

### Database Concept

Restricts payment mode to valid values.

### SKCP Context

Represents how payment was received.

---

## Line 7

```sql
reference_number VARCHAR(100)
```

### SQL Syntax

Optional payment reference.

### Database Concept

Some payment modes require verification.

### SKCP Context

Examples:

UPI Transaction ID

Cheque Number

Bank Reference Number

Cash payments usually remain NULL.

---

## Line 8

```sql
received_by VARCHAR(100)
```

### SQL Syntax

Stores who collected the payment.

### Database Concept

Maintains accountability.

### SKCP Context

Examples:

Father

Office Staff

Future Employee

---

## Line 9

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Flexible business information.

### SKCP Context

Examples:

Advance payment

Final settlement

Cheque pending clearance

---

## Line 10

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores record creation date and time.

### Database Concept

Audit column.

### SKCP Context

Useful for:

- Reports
- Audit
- AI analysis
- Debugging

---

# Step 4 — Architect Notes

### Why separate Payment and Payment Allocation?

One payment may settle:

- One order
- Multiple orders
- Part of one order

Therefore:

Payment

↓

Payment Allocation

is a standard ERP design.

---

### Why store only Total Amount Received?

Payment records the money received.

How that money is distributed across orders belongs in Payment Allocation.

---

### Why CustomerID?

A customer may make many payments over time.

Relationship:

Customer

↓

Payment

---

### Why not store Pending Balance?

Pending Balance is a **derived value**.

It is calculated from:

Orders

+

Payments

+

Payment Allocations

Never store derived values.

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

## Payment Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Payment.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Parent table for Payment Allocation

---

# 📘 Lesson Summary

Today you learned:

- What a Payment Header table is
- Difference between Payment and Payment Allocation
- Why payments belong to customers
- Why financial amounts use DECIMAL
- Why Pending Balance is calculated instead of stored
- Another enterprise Header–Detail design pattern

---

## Architect Verdict

Excellent.

The Payment table establishes the financial transaction layer of SKCP.

Once **Payment Allocation** is completed, the Finance module will fully support:

Customer

↓

Order

↓

Payment

↓

Payment Allocation

This is the same financial architecture used in professional ERP systems like SAP, Oracle ERP, Microsoft Dynamics, and Odoo.