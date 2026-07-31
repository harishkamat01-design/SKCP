# 💰 Payment

---

## Purpose

The **Payment** table stores every payment received from customers.

It answers the business question:

> **"What payment has the customer made?"**

This table records only the payment transaction.

The allocation of that payment across one or more orders is handled separately in **Payment Allocation**.

---

## Business Questions Answered

This table helps answer:

- Who made the payment?
- When was the payment received?
- How much money was received?
- What was the payment mode?
- Who received the payment?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| PaymentID (PK) | Unique payment transaction | Identifies one payment |
| CustomerID (FK) | References Customer | Who made the payment |
| PaymentDate | Date payment received | Business transaction date |
| TotalAmountReceived | Total payment amount | Entire amount received |
| PaymentMode | Cash / UPI / Bank Transfer / Cheque | Mode of payment |
| ReferenceNumber | UPI Ref / Cheque No / Bank Ref (Optional) | Payment verification |
| ReceivedBy | Father / Staff | Who received the payment |
| Remarks | Optional notes | Additional information |

---

## Business Relationship

```text
             Customer

                 │

                 ▼

             Payment

                 │

                 ▼

        Payment Allocation
```

One Customer can make:

- Multiple Payments

One Payment can be allocated to:

- One or More Orders

---

## Business Rules

- Every Payment belongs to one Customer.
- A Payment records the total amount received.
- Payment Allocation distributes the amount across orders.
- Payment information is never duplicated in Order.
- Payment can be received through different payment modes.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Order Number | Payment Allocation | One payment may cover multiple orders |
| Pending Amount | System Calculation | Derived value |
| Product Details | Order Item | Sales information |
| Delivery Details | Delivery | Logistics information |
| Allocation Amount | Payment Allocation | Allocation responsibility |

---

## Architect Discoveries

### Payment is Independent

One important discovery:

A payment is simply money received.

It does **not** automatically belong to one order.

Example:

Customer pays:

₹30,000

The system decides how to distribute it across orders.

---

### Father Thinks Customer First

Your father remembers:

Mr. Ratan

Total Pending

₹20,000

Paid

₹30,000

He does not think in terms of Payment IDs or Order IDs.

The software will therefore present information customer-first while the database remains normalized.

---

### Automatic Allocation

We intentionally designed the system so that:

Father enters:

₹30,000

↓

Software automatically allocates the payment.

↓

Father does not manually divide the payment.

This greatly reduces manual effort and mistakes.

---

## Architect Decisions

- Payment is a Transaction table.
- Customer owns customer information.
- Payment Allocation owns distribution across orders.
- Payment stores only the total amount received.
- Automatic allocation will be performed by the system.

---

## Future Enhancements

Possible future additions:

- Payment Receipt PDF
- Customer Signature
- Bank Reconciliation Status
- Online Payment Gateway
- AI Payment Prediction
- Automatic Receipt Generation

These enhancements are intentionally deferred until required by the business.

---
## Status

**Status:** ✅ Frozen

**Domain:** Finance

**Data Classification:** Transaction Data

**Owner:** Finance & Accounts

**Related Tables:**

- Customer
- Payment Allocation

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |