# 🚚 Delivery

---

## Purpose

The **Delivery** table stores the header information of every vehicle trip made to deliver cement blocks to customers.

It answers the business question:

> **"Which delivery was made, when was it made, and for which customer order?"**

One Delivery represents **one vehicle trip**.

The individual products delivered in that trip are stored separately in **Delivery Item**.

---

## Business Questions Answered

This table helps answer:

- Which order is being delivered?
- When was the delivery made?
- Which vehicle performed the delivery?
- Who was the driver?
- What is the current delivery status?

---

## Table Structure

| Column | Description | Why it belongs here |
|---------|-------------|---------------------|
| DeliveryID (PK) | Unique delivery identifier | Identifies one vehicle trip |
| OrderID (FK) | References Order | Which customer order is being delivered |
| DeliveryDate | Date of delivery | Business transaction date |
| VehicleID (FK) | References Vehicle | Which vehicle performed the trip |
| DriverName | Driver of the vehicle | Operational information |
| DeliveryStatus | Planned / In Transit / Delivered / Cancelled | Current delivery lifecycle |
| Remarks | Optional notes | Additional operational information |

---

## Business Relationship

```text
               Order
                 │
                 ▼
             Delivery
                 │
                 ▼
          Delivery Item
                 │
                 ▼
      Delivery Confirmation
```

One Order can have:

- Multiple Deliveries

One Delivery can contain:

- Multiple Delivery Items

One Delivery has:

- One Delivery Confirmation

---

## Business Rules

- Every Delivery belongs to exactly one Order.
- One Delivery represents one vehicle trip.
- One Order may require multiple deliveries.
- Delivery Status changes as the trip progresses.
- Delivery is completed only after confirmation.

---

## What Does NOT Belong Here?

| Attribute | Belongs To | Reason |
|-----------|------------|--------|
| Product Details | Delivery Item | One delivery may carry multiple products |
| Delivered Quantity | Delivery Item | Product-level information |
| Customer Details | Customer | Master Data |
| Payment Details | Payment | Financial transaction |
| Confirmation Call | Delivery Confirmation | Separate business event |

---

## Architect Discoveries

### One Vehicle Trip = One Delivery

One of the most important logistics discoveries during business analysis:

> **One vehicle trip always becomes one Delivery record.**

Example:

Vehicle carries:

- 100 × 4" Blocks
- 50 × 6" Blocks

This is still **one Delivery** because it is one trip.

The individual products are recorded inside **Delivery Item**.

---

### Partial Deliveries

A large customer order may require multiple deliveries.

Example:

Order:

1000 × 6" Blocks

Delivery-1

600 Blocks

↓

Delivery-2

200 Blocks

↓

Delivery-3

200 Blocks

The Order remains the same.

Only Deliveries increase.

---

### Delivery Does Not Reduce Inventory Directly

The physical movement is represented by Delivery.

The quantity reduction occurs through Delivery Item.

This keeps responsibilities separated.

---

## Architect Decisions

- Delivery is a Transaction table.
- One vehicle trip equals one Delivery.
- Multiple products can travel in one Delivery.
- One Order supports multiple Deliveries.
- Delivery completion is recorded separately through Delivery Confirmation.

---

## Future Enhancements

Possible future additions:

- GPS Tracking
- Vehicle Odometer Reading
- Fuel Consumption
- Delivery Route
- Estimated Arrival Time (ETA)
- Driver Mobile Number

These enhancements are intentionally deferred until required by the business.

---

## Status

| Item | Status |
|------|--------|
| Domain | Sales |
| Table Status | ✅ Approved |
| Sprint | Sprint 2 – Business Domain & Database Design |
| Last Updated | 29 July 2026 |
| Architect | Harish Kamat & ChatGPT |

---

## Version History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 29-Jul-2026 | Initial approved design | Harish Kamat & ChatGPT |