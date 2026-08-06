# Delivery_Module.md

# SKCP Project
## Module 19 – Delivery Module

---

# Module Overview

The **Delivery Module** manages the physical dispatch of customer orders.

Once an Order is created, one or more deliveries can be scheduled depending upon the quantity ordered and transportation capacity.

A single order may require multiple delivery trips.

Example

```
Order #1001

↓

Trip 1

↓

Trip 2

↓

Trip 3
```

Each trip is stored as one Delivery record.

---

# Business Purpose

The Delivery module exists because

- Large customer orders cannot always be delivered in one trip.
- Different trips may use different vehicles.
- Transport cost may vary.
- Delivery status must be tracked.
- Driver and vehicle information should be stored.
- Future DeliveryItem module will record which products were delivered in each trip.

---

# Business Workflow

```
Customer

↓

Orders

↓

Delivery Planning

↓

Delivery

↓

DeliveryItem

↓

Customer Receives Material

↓

Payment Collection
```

---

# Database Explanation

Table

```sql
delivery
```

Purpose

Stores delivery header information.

One row = One vehicle trip.

---

# Column Explanation

## delivery_id

Primary Key

Uniquely identifies every delivery.

---

## order_id

Foreign Key

References

```
orders(order_id)
```

Relationship

Many Deliveries

↓

One Order

---

## delivery_date

Stores actual delivery date.

---

## trip_number

Stores current trip number.

Example

```
Trip 1

Trip 2

Trip 3
```

---

## total_trips

Stores total planned trips.

Useful for

```
Trip 2 of 5
```

---

## vehicle_type

Stores

- Mini Truck
- Pickup
- Lorry

etc.

---

## vehicle_number

Stores registration number.

Example

```
KA30AB1234
```

---

## driver_name

Stores driver information.

---

## transport_mode

Current values

```
CUSTOMER_ARRANGED

FACTORY_ARRANGED

THIRD_PARTY
```

---

## transport_cost

Stores transportation charges.

Datatype

```
DECIMAL(12,2)
```

---

## delivery_status

Possible values

```
PENDING

IN_TRANSIT

DELIVERED
```

---

## remarks

Stores additional notes.

---

## created_at

Automatically generated timestamp.

---

# Relationships

## Orders → Delivery

```
Orders (1)
      │
      ▼
Delivery (Many)
```

One Order

↓

Many Delivery Trips

---

# ER Diagram

```
Customer
      │
      ▼
 Orders
      │
      ▼
 Delivery
      │
      ▼
DeliveryItem
```

---

# Entity Explanation

Class

```
Delivery
```

Annotations

```java
@Entity

@Table(name="delivery")
```

Maps Java Entity

↓

PostgreSQL Table

---

## Primary Key

```java
@Id

@GeneratedValue(strategy = GenerationType.IDENTITY)
```

Maps

```
delivery_id
```

---

## Orders Relationship

```java
@ManyToOne

@JoinColumn(name="order_id")
```

Many Deliveries

↓

One Order

---

## Delivery Date

```java
LocalDate
```

---

## Trip Number

Stores current trip.

---

## Total Trips

Stores planned trips.

---

## Vehicle Information

Stores

- Type
- Number
- Driver

---

## Transport Cost

Uses

```java
BigDecimal
```

Reason

Enterprise monetary datatype.

---

## Delivery Status

Stores

```
PENDING

IN_TRANSIT

DELIVERED
```

---

## CreatedAt

Automatically populated

```java
@PrePersist
```

---

# Repository Explanation

Class

```
DeliveryRepository
```

Extends

```java
JpaRepository<Delivery,Integer>
```

Automatically provides

- save()

- findAll()

- findById()

- delete()

No SQL required.

---

# Service Explanation

Class

```
DeliveryService
```

Business Layer

Responsibilities

- Save Delivery

- Fetch Deliveries

- Update Delivery

- Delete Delivery

---

Current Methods

```java
saveDelivery()

getAllDeliveries()

getDeliveryById()

updateDelivery()

deleteDelivery()
```

---

# Controller Explanation

Class

```
DeliveryController
```

REST Endpoint

```
/api/deliveries
```

Uses

```java
ResponseEntity
```

Returns proper HTTP status codes.

---

# CRUD APIs

---

## Create Delivery

POST

```
POST /api/deliveries
```

Sample

```json
{
  "order": {
    "orderId": 1
  },
  "deliveryDate": "2026-08-06",
  "tripNumber": 1,
  "totalTrips": 2,
  "vehicleType": "Mini Truck",
  "vehicleNumber": "KA30AB1234",
  "driverName": "Ramesh",
  "transportMode": "FACTORY_ARRANGED",
  "transportCost": 1500.00,
  "deliveryStatus": "PENDING",
  "remarks": "First trip"
}
```

---

## Get All

```
GET /api/deliveries
```

---

## Get By ID

```
GET /api/deliveries/1
```

---

## Update

```
PUT /api/deliveries/1
```

Sample

```json
{
  "order": {
    "orderId": 1
  },
  "deliveryDate": "2026-08-06",
  "tripNumber": 1,
  "totalTrips": 2,
  "vehicleType": "Mini Truck",
  "vehicleNumber": "KA30AB1234",
  "driverName": "Ramesh Kumar",
  "transportMode": "FACTORY_ARRANGED",
  "transportCost": 1700.00,
  "deliveryStatus": "DELIVERED",
  "remarks": "Goods delivered successfully"
}
```

---

## Delete

```
DELETE /api/deliveries/1
```

---

# Design Decisions

## Why separate Delivery from Orders?

Enterprise ERP Design.

One Order

↓

Many Deliveries

---

## Why store Trip Number?

Makes logistics tracking easy.

Example

```
Trip 2 of 4
```

---

## Why store Vehicle Information?

Useful for

- Dispatch
- Audit
- Legal records
- Reporting

---

## Why BigDecimal?

Money

↓

Always

```java
BigDecimal
```

Never

```java
double
```

---

## Why ManyToOne?

One Order

↓

Many Deliveries

This is the correct ERP relationship.

---

## Why not DeliveryItem here?

Delivery stores only

Delivery Header

Products belong inside

```
DeliveryItem
```

which will be implemented next.

---

# Enterprise Observations

This module follows Enterprise Standards.

✔ Normalized Database Design

✔ Parent–Child Architecture

✔ RESTful APIs

✔ Constructor Dependency Injection

✔ Service Layer Pattern

✔ JPA Relationships

✔ Monetary Precision

✔ Automatic Timestamp

✔ PostgreSQL Compatible

✔ Ready for DeliveryItem Integration

---

# Future Enhancements

Future versions can include

## Additional Columns

```
receiver_name

receiver_mobile

receiver_signature

proof_of_delivery_image

gps_location

eway_bill_number

loading_time

unloading_time

fuel_cost

trip_distance

invoice_number
```

---

## Additional Status

```
FAILED

RETURNED

PARTIALLY_DELIVERED

CANCELLED
```

---

## Service Enhancements

- Validate Trip Number
- Validate Total Trips
- Prevent Delivery after Order Cancellation
- Update Order Status Automatically
- Update Finished Goods Stock
- Generate Delivery Challan
- GPS Tracking
- Driver Assignment
- Transport Cost Analytics

---

## Reporting

Future reports

- Daily Deliveries
- Pending Deliveries
- Driver-wise Deliveries
- Vehicle-wise Deliveries
- Monthly Dispatch Report
- Transport Cost Report

---

# Enterprise Architecture

```
Customer

↓

Orders

↓

Delivery

↓

DeliveryItem

↓

Payment
```

---

# Module Status

| Layer | Status |
|--------|--------|
| Database | ✅ Completed |
| Entity | ✅ Completed |
| Repository | ✅ Completed |
| Service | ✅ Completed |
| Controller | ✅ Completed |
| Postman CRUD | ✅ Completed |
| Documentation | ✅ Completed |

---

# Module Completion

**Delivery Module is now fully completed and integrated into the SKCP Backend.**

It is ready to integrate with:

- OrderItem
- DeliveryItem
- FinishedGoodsStock
- Payment
- Invoice
- Reports