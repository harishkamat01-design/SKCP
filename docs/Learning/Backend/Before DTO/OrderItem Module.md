
# OrderItem_Module.md

# SKCP Project
## Module 17 – OrderItem Module

---

# Module Overview

The **OrderItem** module stores all products that belong to a customer order.

An Order is the document/header.

OrderItem stores the individual products inside that order.

Example

Order #1001

| Product | Qty | Price |
|----------|----:|------:|
|4" Block|100|36|
|6" Block|250|37|
|8" Block|50|45|

Instead of storing everything in one Orders table, OrderItem follows database normalization and stores every product as a separate row.

---

# Business Purpose

The OrderItem module exists because

- One customer order can contain multiple products.
- Every product may have different quantity.
- Every product may have different selling price.
- Future invoice calculations depend on this table.
- Delivery module will deliver Order Items, not Orders.

---

# Business Workflow

Customer

↓

Order Created

↓

Products Added

↓

OrderItem Records Created

↓

Delivery Module

↓

Payment Module

---

# Database Explanation

Table

```sql
order_item
```

Purpose

Stores individual products inside an Order.

---

## Columns

### order_item_id

Primary Key

Uniquely identifies each Order Item.

---

### order_id

Foreign Key

References

```text
orders(order_id)
```

Relationship

Many OrderItems belong to one Order.

---

### product_id

Foreign Key

References

```text
product(product_id)
```

Relationship

Many OrderItems can reference the same Product.

---

### ordered_quantity

Stores quantity ordered.

Validation

```sql
CHECK (ordered_quantity > 0)
```

---

### unit_selling_price

Stores selling price at the time of order.

Reason

Even if product prices change later, historical orders remain unchanged.

Validation

```sql
CHECK (unit_selling_price >= 0)
```

---

### remarks

Stores optional notes.

---

### created_at

Stores creation timestamp.

Automatically generated.

---

# Relationships

## Orders → OrderItem

```text
Orders (1)
      │
      │
      ▼
OrderItem (Many)
```

One Order

↓

Many Order Items

---

## Product → OrderItem

```text
Product (1)
      │
      │
      ▼
OrderItem (Many)
```

One Product

↓

Can appear in many Orders.

---

# ER Diagram

```text
Customer
    │
    ▼
 Orders
    │
    ▼
OrderItem
    ▲
    │
 Product
```

---

# Entity Explanation

Class

```java
OrderItem
```

Annotations

```java
@Entity
@Table(name="order_item")
```

Maps Java Object to PostgreSQL table.

---

## Primary Key

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
```

Maps

```text
order_item_id
```

---

## Relationship with Orders

```java
@ManyToOne

@JoinColumn(name="order_id")
```

Many Order Items

↓

One Order

---

## Relationship with Product

```java
@ManyToOne

@JoinColumn(name="product_id")
```

Many Order Items

↓

One Product

---

## Ordered Quantity

```java
@Column(name="ordered_quantity")
```

Stores quantity ordered.

---

## Selling Price

```java
@Column(name="unit_selling_price")
```

Uses

```java
BigDecimal
```

Reason

Enterprise monetary precision.

---

## Remarks

Optional notes.

---

## CreatedAt

Automatically populated

```java
@PrePersist
```

---

# Repository Explanation

Class

```java
OrderItemRepository
```

Extends

```java
JpaRepository<OrderItem,Integer>
```

Provides

- save()

- findAll()

- findById()

- delete()

without writing SQL.

---

# Service Explanation

Class

```java
OrderItemService
```

Business Layer

Responsibilities

- Save Order Item

- Fetch Order Items

- Delete Order Item

- Retrieve by ID

---

Current Methods

```java
getAllOrderItems()

saveOrderItem()

getOrderItemById()

deleteOrderItem()
```

---

# Controller Explanation

Class

```java
OrderItemController
```

REST Endpoint

```text
/api/order-items
```

Uses

```java
ResponseEntity
```

Returns proper HTTP Status Codes.

---

# CRUD APIs

---

## Create

POST

```http
POST /api/order-items
```

Sample

```json
{
    "order": {
        "orderId": 1
    },
    "product": {
        "productId": 1
    },
    "orderedQuantity": 100,
    "unitSellingPrice": 36.00,
    "remarks": "Customer ordered 100 blocks"
}
```

---

## Get All

```http
GET /api/order-items
```

---

## Get By ID

```http
GET /api/order-items/1
```

---

## Update

```http
PUT /api/order-items/1
```

Sample

```json
{
    "order": {
        "orderId": 1
    },
    "product": {
        "productId": 1
    },
    "orderedQuantity": 120,
    "unitSellingPrice": 37.00,
    "remarks": "Quantity updated after confirmation"
}
```

---

## Delete

```http
DELETE /api/order-items/1
```

---

# Design Decisions

## Why separate Order and OrderItem?

Enterprise ERP Design.

Because

One Order

↓

Contains Multiple Products

---

## Why BigDecimal?

Money should never use

```java
double
```

BigDecimal prevents precision loss.

---

## Why store selling price?

Product prices change over time.

Historical Orders must never change.

---

## Why ManyToOne?

Because

One Product

↓

Can appear

in

1000 Orders.

---

## Why not total amount?

Instead of storing

```text
Line Total
```

we calculate

```text
orderedQuantity × unitSellingPrice
```

This avoids redundancy.

---

# Enterprise Observations

This module follows Enterprise ERP Standards.

✔ Database Normalization (3NF)

✔ Parent–Child Architecture

✔ Historical Price Preservation

✔ Proper Monetary Data Type

✔ RESTful CRUD APIs

✔ Service Layer Architecture

✔ Constructor Dependency Injection

✔ JPA Relationships

✔ Automatic Timestamp Management

✔ PostgreSQL Compatible Design

---

# Future Enhancements

Future versions can include

## Additional Columns

```text
discount_percent

discount_amount

gst_percent

gst_amount

line_total

delivered_quantity

returned_quantity

cancelled_quantity

pending_quantity

batch_number

warehouse_location
```

---

## Service Enhancements

- Validate Product Availability

- Check Finished Goods Stock

- Reserve Inventory

- Calculate Line Total

- Auto-update FinishedGoodsStock

- Prevent Duplicate Product in Same Order (Optional Business Rule)

---

## Controller Enhancements

- Search Order Items

- Filter by Product

- Filter by Order

- Pagination

- Sorting

- Export to Excel

- Export to PDF

---

# Module Status

| Layer | Status |
|--------|--------|
|Database|✅ Completed|
|Entity|✅ Completed|
|Repository|✅ Completed|
|Service|✅ Completed|
|Controller|✅ Completed|
|Postman CRUD|✅ Completed|
|Documentation|✅ Completed|

---

# Ready for Integration

This module is now fully integrated into the SKCP Backend and is ready to connect with:

- Orders

- FinishedGoodsStock

- Delivery

- DeliveryItem

- Payment

- Invoice
