# Payment Module Documentation

**Project:** SKCP (Shree Kundodari Cement Products)  
**Module:** Finance → Payment  
**Version:** 1.0  
**Status:** Completed  
**Author:** Harish Kamat  
**Reviewed By:** Solution Architect  
**Last Updated:** 06-Aug-2026

---

# 1. Module Objective

The Payment module is responsible for recording every payment received from customers.

This module **does not allocate payments to orders**.

Payment allocation is handled by the **PaymentAllocation** module.

This separation follows Enterprise ERP architecture.

---

# 2. Business Explanation

A customer can:

- Purchase multiple orders.
- Make one payment against one order.
- Make one payment against multiple orders.
- Pay partially.
- Pay in multiple installments.

Example:

Customer Outstanding

| Order | Amount |
|--------|---------|
| Order 101 | ₹5,000 |
| Order 102 | ₹3,000 |
| Order 103 | ₹2,000 |

Customer pays

₹7,000

Payment Module stores

```
Payment
--------

Amount = ₹7000
```

PaymentAllocation stores

```
Payment 10

↓

Order101 = ₹5000

↓

Order102 = ₹2000
```

Remaining

```
Order103 = Pending
```

This design is used by SAP, Oracle ERP, Microsoft Dynamics, Odoo and other ERP systems.

---

# 3. Database Explanation

Table

```
payment
```

Purpose

Stores customer payment transaction header.

Primary Key

```
payment_id
```

Relationship

```
Customer (1)

↓

Payment (Many)
```

Payment does NOT contain

- Order ID
- Invoice ID
- Allocation Amount

These belong to PaymentAllocation.

---

# 4. Table Structure

| Column | Purpose |
|---------|----------|
| payment_id | Primary Key |
| customer_id | Customer making payment |
| payment_date | Payment received date |
| total_amount_received | Amount received |
| payment_mode | CASH / UPI / BANK_TRANSFER / CHEQUE |
| reference_number | Transaction reference |
| received_by | Employee / Owner receiving payment |
| remarks | Additional notes |
| created_at | Audit timestamp |

---

# 5. Entity Explanation

Class

```
Payment.java
```

Annotations Used

```
@Entity

@Table

@Id

@GeneratedValue

@ManyToOne

@JoinColumn

@PrePersist
```

Relationship

```
@ManyToOne

Customer

↓

Payment
```

Meaning

One customer can make multiple payments.

BigDecimal

```
BigDecimal totalAmountReceived
```

Used for monetary precision.

PrePersist

Automatically stores

```
createdAt
```

during insertion.

---

# 6. Repository Explanation

Class

```
PaymentRepository
```

Extends

```
JpaRepository<Payment, Integer>
```

Automatically provides

- save()

- findAll()

- findById()

- deleteById()

- existsById()

- count()

No custom queries required currently.

Future repository methods

```
findByCustomerCustomerId()

findByPaymentMode()

findByPaymentDate()

findByReceivedBy()
```

---

# 7. Service Explanation

Class

```
PaymentService
```

Responsibilities

- Save Payment

- Get All Payments

- Get Payment By ID

- Update Payment

- Delete Payment

Architecture

```
Controller

↓

Service

↓

Repository

↓

Database
```

Current Business Logic

CRUD only.

Future Business Logic

- Validate payment amount

- Validate customer

- Auto receipt generation

- Trigger PaymentAllocation

- Update outstanding amount

- Financial reports

---

# 8. Controller Explanation

Class

```
PaymentController
```

Base URL

```
/api/payments
```

Responsibilities

- Accept REST Requests

- Call Service

- Return HTTP Responses

No business logic.

---

# 9. CRUD APIs

## Create Payment

POST

```
/api/payments
```

Example

```json
{
    "customer": {
        "customerId": 1
    },
    "paymentDate": "2026-08-06",
    "totalAmountReceived": 15000.00,
    "paymentMode": "UPI",
    "referenceNumber": "UPI202608060001",
    "receivedBy": "Harish Kamat",
    "remarks": "Advance payment received"
}
```

---

## Get All Payments

GET

```
/api/payments
```

---

## Get Payment By ID

GET

```
/api/payments/{id}
```

---

## Update Payment

PUT

```
/api/payments/{id}
```

Example

```json
{
    "customer": {
        "customerId": 1
    },
    "paymentDate": "2026-08-07",
    "totalAmountReceived": 18000.00,
    "paymentMode": "BANK_TRANSFER",
    "referenceNumber": "NEFT202608070001",
    "receivedBy": "Harish Kamat",
    "remarks": "Updated after bank confirmation"
}
```

---

## Delete Payment

DELETE

```
/api/payments/{id}
```

---

# 10. HTTP Status Codes

| Operation | Status |
|------------|--------|
| POST | 201 Created |
| GET | 200 OK |
| PUT | 200 OK |
| DELETE | 204 No Content |
| Not Found | 404 |

---

# 11. Architect Review

## Database

✅ Fully normalized.

## Relationships

```
Customer (1)

↓

Payment (Many)
```

Correct.

## Money

Uses

```
BigDecimal
```

Recommended.

## Audit

Uses

```
createdAt
```

Correct.

## Separation

Payment stores

```
Money Received
```

PaymentAllocation stores

```
Where Money Was Used
```

Excellent enterprise design.

---

# 12. Design Decisions

### Decision 1

Payment is separated from PaymentAllocation.

Reason

Supports

- Partial payments

- Multiple order settlement

- Installments

---

### Decision 2

Customer relationship

```
@ManyToOne
```

Correct.

---

### Decision 3

Use

```
BigDecimal
```

instead of

```
double
```

for financial accuracy.

---

### Decision 4

Use

```
LocalDate
```

for payment date.

Time is separately stored in

```
createdAt
```

---

# 13. Future Enhancements

### Receipt Number

```
RCT-2026-0001
```

---

### PDF Receipt

Generate printable receipt.

---

### WhatsApp Integration

Auto-send receipt.

---

### Payment Allocation

Automatically distribute payment.

---

### Outstanding Calculation

Automatically update pending balance.

---

### Customer Ledger

Complete payment history.

---

### Payment Reports

- Daily collection

- Monthly collection

- Cash report

- UPI report

- Bank report

---

### Dashboard Integration

Show

- Today's Collection

- Total Collection

- Outstanding Amount

- Collection Trend

---

# 14. Enterprise Observations

This module follows Enterprise Architecture principles.

✔ Layered Architecture

```
Controller

↓

Service

↓

Repository

↓

Database
```

✔ Spring Boot Standards

✔ JPA Best Practices

✔ Constructor Injection

✔ Normalized Database

✔ ERP Financial Design

✔ Future-ready for Payment Allocation

✔ Future-ready for Receipts

✔ Future-ready for Reporting

✔ Production Ready

---

# 15. Module Completion Status

| Layer | Status |
|---------|--------|
| Database | ✅ Completed |
| Entity | ✅ Completed |
| Repository | ✅ Completed |
| Service | ✅ Completed |
| Controller | ✅ Completed |
| CRUD Testing | ✅ Completed |
| Documentation | ✅ Completed |

---

# Module Status

**Finance → Payment Module : COMPLETED ✅**

**Next Module**

➡️ **PaymentAllocation**