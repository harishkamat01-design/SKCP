# 🏆 Architect Observation 014

# The Business Records Events, Not Data

---

## Business Situation

During Sprint 2, we repeatedly referred to your father's notebook.

Something interesting became clear.

He never wakes up and writes:

- Current Stock = 600
- Pending Amount = ₹20,000
- Inventory = 450

Instead, he records events.

Examples:

- Purchased Cement
- Produced Blocks
- Delivered Blocks
- Received Payment

Everything else is understood from those events.

---

## Problem

Many software systems ask users to maintain calculated information manually.

Examples:

- Current Stock
- Pending Amount
- Balance
- Inventory Value

This increases:

- Manual work
- Human error
- Data inconsistency

---

## Discovery

Businesses naturally record **events**.

Systems naturally calculate **state**.

The ERP should therefore ask users to record only what actually happened.

The system should calculate everything else.

---

## Why It Matters

Events never change.

Calculations can always be reproduced.

If the system stores events correctly:

- Current Stock
- Pending Amount
- Sales
- Production
- Inventory

can always be calculated accurately.

---

## Impact on Database Design

This principle influenced nearly every module.

### Purchase

Records:

Purchase Event

---

### Production

Records:

Production Event

---

### Delivery

Records:

Delivery Event

---

### Payment

Records:

Payment Event

---

### Inventory

Reflects the result of all previous events.

---

## Real Business Example

Father records:

Purchased

500 Cement Bags

↓

Produced

200 Blocks

↓

Delivered

150 Blocks

↓

Received

₹30,000

He never calculates inventory manually.

The ERP performs those calculations automatically.

---

## Final Architect Principle

> **Users should record events.**

> **The system should calculate business state.**

Never ask users to maintain information that can be derived from recorded events.

---

## Future Impact

This principle becomes the foundation for:

- Dashboards
- AI Insights
- Inventory Reports
- Financial Reports
- Production Reports
- Customer Ledgers
- Forecasting

Every report becomes trustworthy because it is derived from immutable business events.

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 014 |
| Category | ERP Philosophy |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 2 |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- Purchase
- Purchase Item
- Order
- Delivery
- Payment
- Payment Allocation
- Raw Material Stock
- Finished Goods Stock

---

## Related Observations

- Observation-002 — Inventory Owns Fluctuating Data
- Observation-005 — The System Performs Accounting
- Observation-013 — Data Must Live Where It Is Owned