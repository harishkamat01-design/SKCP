# 🚚 Delivery

# Delivery (Transaction Table)

---

# Purpose

The Delivery table records every physical dispatch of finished goods from the Sales Yard to a customer.

A delivery represents the movement of products out of the factory and serves as the basis for inventory updates, transport tracking, and payment collection.

---

# Business Responsibility

The Delivery table answers:

- When were products delivered?
- Which order does the delivery belong to?
- Was the order delivered in one trip or multiple trips?
- Who arranged transportation?
- What was the transport cost?
- Which vehicle and driver were used?
- What is the delivery status?

---

# Table Structure

| Column | Type | Description |
|----------|------|-------------|
| DeliveryID (PK) | UUID / INT | Unique delivery |
| OrderID (FK) | FK | Customer order reference |
| DeliveryDate | DATE | Date of dispatch |
| TripNumber | INT | Current trip number |
| TotalTrips | INT | Total planned trips |
| VehicleType | VARCHAR | Vehicle used (e.g., Bajaj ACE, Tractor, Truck) |
| VehicleNumber | VARCHAR | Registration number |
| DriverName | VARCHAR | Driver responsible |
| TransportMode | ENUM | Customer Arranged / Factory Arranged / Third Party |
| TransportCost | DECIMAL | Transportation charge |
| DeliveryStatus | ENUM | Pending / In Transit / Delivered |
| Remarks | TEXT | Additional notes |

---

# Primary Key

DeliveryID

---

# Foreign Key

OrderID → Order(OrderID)

Relationship:

One Order

↓

Many Deliveries

---

# Business Rules

## Rule 1

Every Delivery belongs to exactly one Order.

---

## Rule 2

One Order may require multiple Deliveries.

Example:

Trip 1 of 3

Trip 2 of 3

Trip 3 of 3

---

## Rule 3

TripNumber and TotalTrips must always be maintained together.

Examples:

Trip 1 / 1

Trip 1 / 3

Trip 2 / 3

Trip 3 / 3

---

## Rule 4

FinishedGoodsStock decreases immediately after a Delivery is completed.

---

## Rule 5

Transportation may be:

- Customer Arranged
- Factory Arranged
- Third Party

---

## Rule 6

TransportCost is stored at the Delivery level because it belongs to the trip, not to individual products.

---

# Business Workflow

Customer Order

↓

Finished Goods Available

↓

Create Delivery

↓

Load Vehicle

↓

Dispatch

↓

Update Finished Goods Stock

↓

Customer Receives Goods

↓

Payment Collection

---

# Example

| Delivery | Order | Trip | Vehicle | Status |
|-----------|------|------|---------|--------|
| D001 | O125 | 1 / 1 | Bajaj ACE | Delivered |
| D002 | O126 | 1 / 3 | Truck | Delivered |
| D003 | O126 | 2 / 3 | Truck | Delivered |
| D004 | O126 | 3 / 3 | Truck | Pending |

---

# Why This Design?

This design reflects SKCP's real delivery process.

Most customer orders are delivered in one trip, but the system supports multiple trips for larger orders without changing the database design.

---

# Future Scope

Future versions may include:

- GPS Tracking
- Driver Management
- Vehicle Management
- Delivery Proof (Photo / Signature)
- Delivery Route Optimization
- Estimated Arrival Time

---

# Status

✅ Frozen (Version 1)

This table accurately models the physical dispatch process from the Sales Yard to the customer while supporting both single-trip and multi-trip deliveries.


---
## OLD VERSION
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