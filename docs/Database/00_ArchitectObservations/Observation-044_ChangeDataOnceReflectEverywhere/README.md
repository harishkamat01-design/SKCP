# 🏆 Architect Observation 044

# Change Data Once, Reflect It Everywhere

---

## Business Situation

During SKCP design, every business fact was intentionally stored only once.

Examples include:

- Customer information
- Product information
- Payment details
- Delivery information
- Inventory quantities

Every other module references that information instead of creating copies.

---

## Problem

Many software systems duplicate business information.

For example:

Customer Name stored in:

- Customer
- Order
- Delivery
- Payment
- Reports

Eventually one copy changes.

The others do not.

Now nobody knows which one is correct.

---

## Discovery

The system should always have one authoritative source for every business fact.

When that source changes, every dependent module should immediately reflect the new information.

No duplicate maintenance should ever be required.

---

## Why It Matters

Single-source updates provide:

- Consistent reports
- Lower maintenance effort
- Fewer bugs
- Better scalability
- Greater business trust

The fewer places that require updating, the healthier the architecture.

---

## Impact on SKCP

### Customer

Customer information changes once.

Orders, Payments and Deliveries automatically reference the updated customer.

---

### Product

Selling price changes once.

Future orders immediately use the latest price.

---

### Payment

A payment is entered once.

Customer balance updates automatically through Payment Allocation.

---

### Finished Goods Stock

Inventory changes once.

Sales, Reports and Dashboard all display the updated quantity.

---

## Real Business Example

Without Proper Architecture

Update Customer Address

↓

Update:

- Customer
- Orders
- Delivery
- Payment

Four updates required.

---

With SKCP

Update Customer

↓

Everything else references CustomerID

↓

Entire system stays consistent.

---

## Final Architect Principle

> **Business information should be maintained once and consumed everywhere.**

The system should reduce repeated maintenance, not increase it.

---

## Future Impact

This principle should guide:

- APIs
- Reports
- AI
- Mobile App
- Dashboards

Whenever information is copied, ask:

"Can this simply be referenced instead?"

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 044 |
| Category | Data Consistency |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Backend Preparation |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- Customer
- Product
- Payment
- Payment Allocation
- Finished Goods Stock
- Delivery

---

## Related Observations

- Observation-007 — Every Table Owns Exactly One Responsibility
- Observation-032 — Every Piece of Data Must Have One Owner
- Observation-039 — Design Version 1 Without Blocking Version 2
- Observation-043 — Every Business Decision Made by the System Must Be Traceable