# FinishedGoodsStock Module

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Inventory

**Component:** FinishedGoodsStock

**Version:** 1.0

**Status:** Completed

**Author:** Harish Kamat

---

# Module Objective

The FinishedGoodsStock module is responsible for maintaining the **current saleable inventory** of finished cement blocks.

This module represents the final inventory stage before the Sales module begins.

Unlike Production and CuringStock, this table stores only the latest stock position for each product.

---

# Business Purpose

Finished goods become available only after:

Production
↓

Curing
↓

Finished Goods Stock

↓

Sales

This table always stores the **current quantity available for sale**.

It is not a transaction history table.

---

# Database Design

## Table Name

finished_goods_stock

---

## Business Rules

- One Product has exactly one Finished Goods Stock record.
- Each Product can exist only once in this table.
- Stock quantity can never be negative.
- Stock level is updated whenever:
  - Production batches become READY.
  - Deliveries reduce stock.
- Status is automatically maintained based on available quantity.

---

## Final Database Structure

| Column | Purpose |
|----------|----------|
| finished_goods_stock_id | Primary Key |
| product_id | Product Reference |
| current_stock_level | Current saleable quantity |
| minimum_stock_level | Alert threshold |
| last_updated_date | Latest stock update |
| status | NORMAL / LOW_STOCK / OUT_OF_STOCK |
| notes | Optional remarks |
| created_at | Record creation timestamp |

---

# Architecture Decisions

## Decision 1

Maintain only the latest stock quantity.

### Reason

Inventory represents the current stock position rather than historical transactions.

Historical movement already exists inside:

- Production
- Delivery

---

## Decision 2

One Product → One FinishedGoodsStock record.

### Implementation

Database:

```sql
product_id UNIQUE
```

JPA:

```java
@OneToOne
@JoinColumn(...)
```

### Reason

Each product has exactly one current inventory position.

---

## Decision 3

Rename

```
minimum_quantity
```

to

```
minimum_stock_level
```

### Reason

The new name clearly communicates business meaning.

---

## Decision 4

Rename

```
current_quantity
```

to

```
current_stock_level
```

### Reason

Stock Level is more meaningful than Quantity because this table stores inventory balance.

---

## Decision 5

Status Values

```
NORMAL

LOW_STOCK

OUT_OF_STOCK
```

### Reason

Allows dashboard alerts without additional calculations.

---

# Entity Layer

## FinishedGoodsStock.java

Responsibilities

- Maps the database table.
- Maintains Product relationship.
- Handles timestamps.
- Stores inventory information.

### Key Features

- @Entity
- @Table
- @OneToOne Product mapping
- @PrePersist
- Java Bean structure
- Clean getters/setters

---

# Repository Layer

## FinishedGoodsStockRepository.java

Responsibilities

Provides database access using Spring Data JPA.

Extends

```java
JpaRepository<
FinishedGoodsStock,
Integer>
```

Benefits

- findAll()
- findById()
- save()
- deleteById()

No custom queries required.

---

# Service Layer

## FinishedGoodsStockService.java

Responsibilities

Acts as the business layer between Controller and Repository.

Functions

- Get all stock
- Save stock
- Find by ID
- Update stock
- Delete stock

Future responsibilities

- Auto-update stock after Production
- Reduce stock after Delivery
- Generate stock alerts

---

# Controller Layer

## FinishedGoodsStockController.java

Responsibilities

Expose REST APIs.

Implemented CRUD endpoints.

Uses

```java
ResponseEntity<?>
```

Proper HTTP Status Codes

- 200 OK
- 201 CREATED
- 404 NOT FOUND
- 204 NO CONTENT

---

# CRUD APIs

---

## Create

POST

```
/api/finished-goods-stock
```

Sample

```json
{
  "product": {
    "productId": 4
  },
  "currentStockLevel": 700,
  "minimumStockLevel": 100,
  "status": "NORMAL",
  "notes": "Initial finished goods stock"
}
```

Expected

201 Created

---

## Get All

GET

```
/api/finished-goods-stock
```

Returns

List of finished goods stock.

---

## Get By ID

GET

```
/api/finished-goods-stock/{id}
```

Returns

Single FinishedGoodsStock record.

---

## Update

PUT

```
/api/finished-goods-stock/{id}
```

Updates

- Current Stock
- Minimum Stock
- Status
- Notes

---

## Delete

DELETE

```
/api/finished-goods-stock/{id}
```

Returns

204 No Content

---

# Postman Testing

Completed

✅ POST

✅ GET ALL

✅ GET BY ID

✅ PUT

✅ DELETE

Verified in

- PostgreSQL
- pgAdmin
- Spring Boot API

---

# Important Observation

The Product relationship is intentionally designed as

```
Product 1 ─────── 1 FinishedGoodsStock
```

Database

```sql
product_id UNIQUE
```

JPA

```java
@OneToOne
@JoinColumn(
    name="product_id",
    unique=true
)
```

This prevents duplicate inventory records for the same product.

Example

Product 1

↓

FinishedGoodsStock

Only ONE row allowed.

Attempting another insert for Product 1 results in

```
duplicate key violates unique constraint
```

This is expected and validates the business rule.

---

# Module Flow

```text
Purchase

↓

Raw Material

↓

Production

↓

Curing

↓

Finished Goods Stock

↓

Sales
```

FinishedGoodsStock is the final inventory stage before Sales.

---

# Future Integration

This module will later integrate with

## Production

When curing becomes READY

↓

Increase Finished Goods Stock

---

## Delivery

Delivery Confirmation

↓

Decrease Finished Goods Stock

---

## Dashboard

Generate

- Low Stock Alerts
- Out of Stock Alerts

---

# Lessons Learned

- Difference between inventory balance and transaction history.
- One-to-One mapping using JPA.
- Importance of UNIQUE constraints.
- Naming columns using business terminology.
- Using ResponseEntity for enterprise REST APIs.
- CRUD validation using Postman.

---

# Module Status

| Layer | Status |
|--------|--------|
| Database | ✅ Completed |
| Entity | ✅ Completed |
| Repository | ✅ Completed |
| Service | ✅ Completed |
| Controller | ✅ Completed |
| CRUD Testing | ✅ Completed |
| Documentation | ✅ Completed |

---

# Module Completion

The FinishedGoodsStock module is fully implemented and tested.

It is now ready for integration with:

- Production
- Delivery
- Dashboard
- Reporting

This completes the Finished Goods Inventory component of the SKCP ERP backend.