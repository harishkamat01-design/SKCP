# DeliveryItem_Module.md

# SKCP Project
## Module 21 – Delivery Item Module

---

# Module Overview

The **Delivery Item Module** stores the actual products delivered during each delivery trip.

While the **Delivery** table stores the trip header (vehicle, driver, transport, etc.), the **DeliveryItem** table stores **what was delivered**.

Each row represents one product delivered in one delivery.

---

# Business Purpose

A single delivery trip can carry multiple products.

Example

```
Delivery #5

↓

6" Solid Block → 200

4" Solid Block → 100

8" Solid Block → 50
```

Instead of storing everything in one Delivery record, each product is stored separately in DeliveryItem.

This follows ERP normalization principles.

---

# Business Workflow

```
Customer

↓

Order

↓

Order Item

↓

Delivery

↓

Delivery Item

↓

Finished Goods Stock

↓

Invoice

↓

Payment
```

---

# Database Explanation

Table

```sql
delivery_item
```

Purpose

Stores every product delivered during a delivery trip.

One row = One Product delivered in One Delivery.

---

# Column Explanation

## delivery_item_id

Primary Key

Uniquely identifies every delivery item.

---

## delivery_id

Foreign Key

References

```text
delivery(delivery_id)
```

Relationship

Many Delivery Items

↓

One Delivery

---

## product_id

Foreign Key

References

```text
product(product_id)
```

Relationship

Many Delivery Items

↓

One Product

---

## delivered_quantity

Stores quantity delivered.

Validation

```sql
CHECK(delivered_quantity > 0)
```

Ensures invalid quantities cannot be stored.

---

## remarks

Stores additional delivery notes.

Example

```
Broken blocks replaced

Delivered separately

Extra quantity supplied
```

---

## created_at

Stores record creation timestamp.

Automatically generated.

---

# Relationships

## Delivery → DeliveryItem

```
Delivery (1)
        │
        ▼
DeliveryItem (Many)
```

One Delivery

↓

Many Products Delivered

---

## Product → DeliveryItem

```
Product (1)
       │
       ▼
DeliveryItem (Many)
```

One Product

↓

Delivered many times.

---

# ER Diagram

```
Customer
      │
      ▼
 Orders
      │
      ▼
OrderItem

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
DeliveryItem
```

Annotations

```java
@Entity

@Table(name="delivery_item")
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
delivery_item_id
```

---

## Delivery Relationship

```java
@ManyToOne

@JoinColumn(name="delivery_id")
```

Relationship

Many Delivery Items

↓

One Delivery

---

## Product Relationship

```java
@ManyToOne

@JoinColumn(name="product_id")
```

Relationship

Many Delivery Items

↓

One Product

---

## Delivered Quantity

Stores

```
deliveredQuantity
```

---

## Remarks

Stores additional notes.

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
DeliveryItemRepository
```

Extends

```java
JpaRepository<DeliveryItem,Integer>
```

Spring Boot automatically provides

- save()

- findAll()

- findById()

- delete()

- exists()

No SQL required.

---

# Service Explanation

Class

```
DeliveryItemService
```

Responsibilities

- Create Delivery Item

- Retrieve Delivery Items

- Update Delivery Item

- Delete Delivery Item

---

Current Methods

```java
saveDeliveryItem()

getAllDeliveryItems()

getDeliveryItemById()

updateDeliveryItem()

deleteDeliveryItem()
```

---

Current Business Logic

Simple CRUD.

No inventory validation yet.

---

# Controller Explanation

Class

```
DeliveryItemController
```

REST Endpoint

```
/api/delivery-items
```

Uses

```java
ResponseEntity
```

Returns proper HTTP status codes.

---

# CRUD APIs

---

## Create

POST

```
POST /api/delivery-items
```

Example

```json
{
    "delivery": {
        "deliveryId": 1
    },
    "product": {
        "productId": 1
    },
    "deliveredQuantity": 200,
    "remarks": "6 inch blocks delivered in Trip 1"
}
```

---

## Get All

```
GET /api/delivery-items
```

---

## Get By ID

```
GET /api/delivery-items/{id}
```

---

## Update

```
PUT /api/delivery-items/{id}
```

Example

```json
{
    "delivery": {
        "deliveryId": 1
    },
    "product": {
        "productId": 1
    },
    "deliveredQuantity": 250,
    "remarks": "Updated delivered quantity after verification"
}
```

---

## Delete

```
DELETE /api/delivery-items/{id}
```

---

# Design Decisions

## Why separate Delivery and DeliveryItem?

ERP Standard.

Delivery stores

```
Trip Header
```

DeliveryItem stores

```
Products Delivered
```

This keeps the database normalized.

---

## Why ManyToOne with Delivery?

One delivery trip contains many products.

Example

```
Trip 1

↓

6"

↓

4"

↓

8"
```

---

## Why ManyToOne with Product?

One product may be delivered in hundreds of deliveries.

Example

```
Delivery 1

↓

6"

Delivery 2

↓

6"

Delivery 3

↓

6"
```

---

## Why not store customer_id?

Already available through

```
Delivery

↓

Order

↓

Customer
```

No duplication.

---

## Why not store selling price?

Selling price belongs to

```
OrderItem
```

DeliveryItem should only record physical movement.

---

# Architect Review

## Normalization

The table satisfies Third Normal Form (3NF).

No duplicated data.

Relationships are clean.

---

## Sales Flow

```
Customer

↓

Order

↓

OrderItem

↓

Delivery

↓

DeliveryItem
```

Every step has a single responsibility.

---

## Current Scope

Current module records

- Delivery
- Product
- Quantity

Nothing more.

---

# Enterprise Observations

This module follows enterprise ERP practices.

✔ Parent–Child Relationship

✔ Many-to-One Mapping

✔ Constructor Injection

✔ Layered Architecture

✔ RESTful API Design

✔ Normalized Database

✔ Automatic Timestamp

✔ PostgreSQL Compatible

✔ Future Ready

---

# Future Enhancements

## Inventory Integration

Automatically

```
FinishedGoodsStock

↓

Minus Delivered Quantity
```

---

## Validation

Prevent

```
Delivered Quantity >

Ordered Quantity
```

---

## Partial Delivery

Support

```
Ordered = 500

Trip 1 = 200

Trip 2 = 150

Trip 3 = 150
```

---

## Damage Tracking

Additional fields

```
damaged_quantity

returned_quantity

accepted_quantity
```

---

## Dispatch Tracking

```
loaded_by

checked_by

warehouse_location

batch_number
```

---

## Invoice Integration

DeliveryItem will become the source for

```
Delivery Challan

Invoice

Dispatch Report
```

---

## Reporting

Future reports

- Product Dispatch Report

- Daily Dispatch Report

- Customer Delivery Report

- Product-wise Delivery Report

- Pending Delivery Report

---

# Enterprise Architecture

```
Customer

↓

Orders

↓

OrderItem

↓

Delivery

↓

DeliveryItem

↓

FinishedGoodsStock

↓

Invoice

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
| CRUD APIs | ✅ Completed |
| Documentation | ✅ Completed |

---

# Module Completion

**DeliveryItem Module is fully completed and integrated into the SKCP Backend.**

It is now ready for integration with:

- FinishedGoodsStock
- Invoice
- Payment
- Reporting
- Analytics
