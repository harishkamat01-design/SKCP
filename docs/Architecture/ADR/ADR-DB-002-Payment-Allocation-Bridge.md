# ADR-DB-002

# Title

Resolve Customer Payment and Order Relationship using Payment Allocation

---

## Status

✅ Accepted

---

## Date

31-Jul-2026

---

## Context

Customers frequently make payments that do not correspond to a single order.

Typical business scenarios include:

- One payment settling multiple pending orders.
- One order being paid through multiple installments.
- Customers making advance or partial payments.

A direct relationship between **Payment** and **Order** cannot represent these business scenarios.

The database design therefore required a mechanism to accurately record payment distribution while preserving financial traceability.

---

## Decision

Introduce a dedicated **PaymentAllocation** transaction table.

The relationship becomes:

```
Customer
     │
     ▼
 Payment
     │
     ▼
PaymentAllocation
     │
     ▼
   Order
```

This resolves the many-to-many relationship between Payments and Orders.

---

## Rationale

Using a bridge table provides maximum flexibility while maintaining normalization.

It enables:

- Partial payments
- Installment payments
- One payment settling multiple orders
- Multiple payments settling one order
- Accurate pending amount calculations
- Complete payment audit trail
- Future AI-based payment analysis

---

## Consequences

### Positive

- Eliminates many-to-many complexity
- Supports installment-based payments
- Supports multi-order settlements
- Preserves complete financial history
- Maintains Third Normal Form (3NF)
- Simplifies outstanding balance calculation

### Negative

- Adds one additional transaction table
- Payment posting requires allocation records

---

## Alternatives Considered

### Option 1

Store OrderID directly inside Payment.

**Rejected**

Reason:

A payment could only belong to one order.

This fails when customers pay for multiple orders together.

---

### Option 2

Store PaymentID inside Order.

**Rejected**

Reason:

An order could only receive one payment.

This fails for installment payments.

---

### Option 3

Create PaymentAllocation bridge table.

**Accepted**

Reason:

Supports every real-world payment scenario while keeping the database normalized.

---

## Business Rules

- Every Payment belongs to exactly one Customer.
- Every PaymentAllocation belongs to one Payment.
- Every PaymentAllocation belongs to one Order.
- One Payment may allocate funds to multiple Orders.
- One Order may receive multiple Payments.
- The total allocated amount must equal the payment amount before saving the transaction.
- Allocation records are generated automatically by the system.
- Users do not manually create PaymentAllocation records.

---

## Impact

Affected Tables

- Customer
- Payment
- PaymentAllocation
- Order

Affected Documents

- Database Relationship Summary
- Master ER Diagram
- PostgreSQL Physical Schema
- Finance Domain Documentation

---

## Decision Owner

Harish Kamat

---

## Review Status

✅ Approved

---

## Related Documents

- Database_Relationship_Summary.md
- Master_ER_Diagram.md
- PostgreSQL_Schema.sql