# 🏆 Architect Observation 004

# One Vehicle Trip Equals One Delivery

---

## Business Situation

While designing the Delivery module, an important business scenario was discussed.

A customer orders:

- 1000 × 6" Blocks

However, the vehicle can carry only:

- 200 Blocks per trip

Therefore, the order cannot be completed in a single trip.

The question became:

> **Should one customer order create one delivery, or multiple deliveries?**

---

## Problem

If one Order represented one Delivery, the ERP would fail to represent reality.

Example:

Order:

1000 Blocks

Vehicle Capacity:

200 Blocks

Reality:

The vehicle must travel multiple times.

The database must represent each physical trip separately.

---

## Discovery

A Delivery is **not** the customer order.

A Delivery is a **logistics event**.

One vehicle trip always equals one Delivery.

---

## Why It Matters

Separating Orders from Deliveries allows the ERP to:

- Support partial deliveries.
- Track every vehicle movement.
- Plan future deliveries.
- Reduce inventory correctly.
- Reflect actual business operations.

---

## Impact on Database Design

This observation created a clear separation.

### Order

Represents the customer's requirement.

↓

### Delivery

Represents one vehicle trip.

↓

### Delivery Item

Represents the products transported during that trip.

---

## Real Business Example

Customer Order

1000 × 6" Blocks

Vehicle Capacity

200 Blocks

The ERP creates:

Delivery-001

200 Blocks

↓

Delivery-002

200 Blocks

↓

Delivery-003

200 Blocks

↓

Delivery-004

200 Blocks

↓

Delivery-005

200 Blocks

The order remains one transaction.

The logistics become five deliveries.

---

## Final Architect Principle

> **Orders represent customer commitments.**

> **Deliveries represent physical logistics.**

Never confuse a business transaction with a transportation event.

---

## Future Impact

This observation enables:

- Delivery scheduling
- Vehicle utilization reports
- Driver performance tracking
- Route optimization
- Delivery cost analysis
- AI delivery planning

Without this separation, none of these features could be implemented cleanly.

---

## Status

| Item | Status |
|------|--------|
| Observation ID | 004 |
| Category | Logistics Architecture |
| Priority | ⭐⭐⭐⭐⭐ |
| Sprint | Sprint 2 |
| Status | ✅ Approved |
| Architect | Harish Kamat & ChatGPT |

---

## Related Tables

- Order
- Delivery
- Delivery Item
- Delivery Confirmation

---

## Related Observations

- Observation-001 — Business Thinks Customer First
- Observation-002 — Inventory Owns Fluctuating Data
- Observation-003 — Production is NOT Finished Goods
- Observation-005 — The System Performs Accounting *(Upcoming)*