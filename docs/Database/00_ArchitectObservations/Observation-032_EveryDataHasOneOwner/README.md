# 🏆 Architect Observation 032

# Every Piece of Data Must Have One Owner

---

## Business Situation

While designing SKCP, we repeatedly asked:

> "Which table actually owns this information?"

Examples:

- Customer Name belongs to Customer.
- Product Price belongs to Product.
- Quantity Ordered belongs to Order Item.
- Quantity Delivered belongs to Delivery Item.
- Payment Received belongs to Payment.

Instead of storing the same information in multiple places, every business fact was assigned a single owner.

---

## Problem

Poor systems duplicate information.

For example:

- Customer Name stored in Order
- Customer Name stored in Payment
- Customer Name stored in Delivery

Eventually:

- One record changes.
- Others do not.
- Reports become inconsistent.
- Users stop trusting the software.

Duplicate ownership creates inconsistent truth.

---

## Discovery

Every business fact should have one authoritative source.

Other modules should reference it—not copy it.

One owner.

Many consumers.

---

## Why It Matters

Single ownership provides:

- Consistent data
- Easier maintenance
- Better reporting
- Fewer update errors
- Higher user trust

When a value changes, it changes only once.

---

## Impact on SKCP

Examples include:

### Customer

Owns:

- Customer Name
- Phone Number
- Address

Other tables store only CustomerID.

---

### Product

Owns:

- Product Name
- Product Size
- Selling Price

Orders reference ProductID.

---

### Payment

Owns:

- Amount Received
- Payment Mode
- Payment Date

Payment Allocation references PaymentID.

---

### Delivery

Owns:

- Delivery Date
- Delivery Status

Delivery Item owns delivered quantities.

---

## Real Business Example

Wrong Design

Customer Name copied into:

- Order
- Delivery
- Payment

↓

Customer changes phone number.

↓

Three tables require updates.

---

Correct Design

Customer owns customer information.

All other modules reference CustomerID.

One update.

Entire system remains consistent.

---

## Final Architect Principle

> **Every business fact should have exactly one owner.**

Reference information.

Never duplicate ownership.

---

## Future Impact

This principle should guide:

- API Design
- Reporting
- AI Features
- Integrations
- Mobile Applications

Whenever adding a new field, first ask:

"Who owns this information?"

If another table already owns it,

reference it instead of copying it.

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 032 |
| Category | Data Ownership |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 3 |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- Customer
- Product
- Order
- Order Item
- Delivery
- Delivery Item
- Payment
- Payment Allocation

---

## Related Observations

- Observation-007 — Every Table Owns Exactly One Responsibility
- Observation-013 — Data Lives Where It Is Owned
- Observation-023 — Every Table Exists to Answer One Business Question
- Observation-028 — The Database Mirrors the Business, It Does Not Define It