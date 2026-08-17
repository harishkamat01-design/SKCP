# PaymentAllocation Module Documentation

**Module:** Payment Allocation  
**Domain:** Finance  
**Project:** SKCP (Shree Kundodari Cement Products)  
**Module Version:** 1.0  
**Status:** Completed ✅  
**Author:** Harish Kamat  
**Architecture:** Spring Boot + PostgreSQL + JPA (Layered Architecture)

---

# 1. Architect Review

## Module Objective

The Payment Allocation module solves one of the biggest real-world business problems in SKCP.

A customer may:

- Make one payment for multiple orders.
- Pay one order using multiple payments.
- Pay partially.
- Clear pending dues gradually.

Therefore, payment itself cannot directly belong to an order.

Instead,

```text
Customer
    │
    │
Payment
    │
    │
PaymentAllocation
    │
    │
Order
```

This follows Enterprise ERP architecture.

---

## Why this table exists

Without PaymentAllocation

```text
Payment
   │
   └────► Order
```

This becomes impossible when:

Customer pays ₹50,000

and wants

- ₹20,000 → Order 1
- ₹15,000 → Order 2
- ₹15,000 → Order 3

PaymentAllocation solves this.

---

## Enterprise Standard

Exactly same architecture followed in

- SAP
- Oracle ERP
- Microsoft Dynamics
- ERPNext
- Tally Prime (internally)

---

# 2. Business Explanation

Suppose

Customer Ravi

has

| Order | Amount |
|---------|---------|
| Order 1 | ₹15,000 |
| Order 2 | ₹20,000 |
| Order 3 | ₹10,000 |

Customer gives

₹30,000

The allocation becomes

| Payment | Order | Allocation |
|----------|--------|------------|
| Payment #1 | Order 1 | ₹15,000 |
| Payment #1 | Order 2 | ₹15,000 |

Remaining

Order 2

Pending

₹5,000

Order 3

Pending

₹10,000

Exactly how real accounting works.

---

# 3. Database Explanation

## Table

```sql
payment_allocation
```

Stores

```text
Payment
        ↔
        Allocation
                 ↔
                 Order
```

### Primary Key

```sql
payment_allocation_id
```

Unique allocation record.

### Foreign Keys

```sql
payment_id
```

References

```sql
payment
```

---

```sql
order_id
```

References

```sql
orders
```

### allocated_amount

Stores how much amount from a payment belongs to an order.

### allocation_date

Stores allocation date.

### remarks

Stores internal notes.

Example

```text
Adjusted against previous pending amount.
```

### created_at

Audit field.

Automatically generated.

---

# 4. Entity Explanation

## Relationships

```java
@ManyToOne
@JoinColumn(name = "payment_id", nullable = false)
private Payment payment;
```

Meaning

Many allocations

↓

One payment

Example

```text
Payment 1

↓

Allocation A

↓

Allocation B

↓

Allocation C
```

---

```java
@ManyToOne
@JoinColumn(name = "order_id", nullable = false)
private Orders order;
```

Meaning

Many allocations

↓

One order

Because one order may receive multiple payments.

---

### Business Fields

```java
allocatedAmount
```

Money allocated to a particular order.

---

```java
allocationDate
```

Stores allocation date.

---

```java
remarks
```

Internal comments.

---

```java
createdAt
```

Audit timestamp.

Automatically generated.

---

# 5. Repository Explanation

Repository extends

```java
JpaRepository<PaymentAllocation, Integer>
```

Automatically provides

- save()
- findAll()
- findById()
- delete()
- exists()

No custom query required.

---

# 6. Service Explanation

Business Layer.

Contains

```java
getAllPaymentAllocations()

getPaymentAllocationById()

savePaymentAllocation()

updatePaymentAllocation()

deletePaymentAllocation()
```

Controller never talks directly to Repository.

Service acts as the business layer.

---

# 7. Controller Explanation

Base URL

```text
/api/payment-allocations
```

Endpoints

| Method | URL | Purpose |
|----------|-------------------------------|----------|
| GET | /api/payment-allocations | Get All |
| GET | /api/payment-allocations/{id} | Get By Id |
| POST | /api/payment-allocations | Create |
| PUT | /api/payment-allocations/{id} | Update |
| DELETE | /api/payment-allocations/{id} | Delete |

Returns

```java
ResponseEntity
```

with proper HTTP Status Codes.

---

# 8. CRUD APIs

## POST

```http
POST /api/payment-allocations
```

Example

```json
{
    "payment": {
        "paymentId": 2
    },
    "order": {
        "orderId": 1
    },
    "allocatedAmount": 5000.00,
    "allocationDate": "2026-08-06",
    "remarks": "Advance payment allocated"
}
```

---

## GET ALL

```http
GET /api/payment-allocations
```

---

## GET BY ID

```http
GET /api/payment-allocations/1
```

---

## PUT

```http
PUT /api/payment-allocations/1
```

Example

```json
{
    "payment": {
        "paymentId": 3
    },
    "order": {
        "orderId": 1
    },
    "allocatedAmount": 5100.00,
    "allocationDate": "2026-08-07",
    "remarks": "Updated allocation after verification"
}
```

---

## DELETE

```http
DELETE /api/payment-allocations/1
```

---

# 9. Design Decisions

## Decision 1

Used

```java
@ManyToOne
```

instead of

```java
@OneToOne
```

Reason

One payment can have many allocations.

---

## Decision 2

Used

```java
BigDecimal
```

instead of

```java
double
```

Reason

Financial values must never lose precision.

---

## Decision 3

Allocation date stored.

Reason

Useful for

- Audit
- Ledger
- Reports
- Tax

---

## Decision 4

No automatic pending calculation.

Reason

Pending balance belongs to the Service Layer business logic.

---

## Decision 5

Audit timestamp automatically generated.

---

# 10. Future Enhancements

Current Version

Simple CRUD.

Future Enterprise Features

- Payment Validation
- Remaining Payment Calculation
- Auto Allocation
- Multiple Currency Support
- Payment Reversal
- Soft Delete
- Audit Logs
- Receipt Generation
- Customer Ledger
- Financial Dashboard

---

# 11. Enterprise Observations

## Observation 1

Payment and Order are intentionally separated.

This makes accounting flexible.

---

## Observation 2

PaymentAllocation acts as the bridge table.

This is a standard ERP design pattern.

---

## Observation 3

Financial modules must always use

```java
BigDecimal
```

Never use

```java
float
double
```

for money.

---

## Observation 4

Business validation is intentionally absent from CRUD.

Checks such as

- Allocation ≤ Payment Amount
- Allocation ≤ Pending Order Amount

should be implemented inside the Service layer.

---

## Observation 5

The database confirms successful integration.

- Payment → PaymentAllocation → Order relationship working.
- Foreign Keys working correctly.
- CRUD operations verified.
- Enterprise layered architecture maintained.

---

# Module Completion Status

| Layer | Status |
|---------|--------|
| PostgreSQL Table | ✅ Completed |
| Entity | ✅ Completed |
| Repository | ✅ Completed |
| Service | ✅ Completed |
| Controller | ✅ Completed |
| CRUD APIs | ✅ Completed |
| Postman Testing | ✅ Completed |
| Database Verification | ✅ Completed |
| Documentation | ✅ Completed |

# Overall Status

## ✅ PaymentAllocation Module — 100% Complete