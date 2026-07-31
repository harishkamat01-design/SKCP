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

## Status

**Status:** ✅ Frozen

**Domain:** Sales

**Data Classification:** Transaction Data

**Owner:** Logistics & Dispatch

**Related Tables:**

- Order
- Delivery Item
- Finished Goods Stock

---
