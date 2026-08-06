# RawMaterialStock Module Documentation

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Inventory Management

**Component:** RawMaterialStock

**Version:** 1.0

**Status:** Completed (CRUD Ready)

**Author:** Harish Kamat

---

# Module Purpose

The RawMaterialStock module maintains the **current stock position** of every raw material used in the manufacturing process.

This module acts as the inventory master for raw materials and is updated whenever:

- Purchase materials are received.
- Materials are consumed during production.
- Stock adjustments are performed.

This table **does not store transaction history**.

Instead, it stores the latest stock position for each raw material.

Transaction history is maintained in:

- Purchase
- PurchaseItem
- Production

---

# Business Objective

The objective of this module is to provide:

- Current stock availability
- Low stock monitoring
- Out of stock monitoring
- Inventory visibility
- Production planning support

---

# Database Design

## Table

```sql
raw_material_stock
```

---

## Table Structure

| Column | Description |
|----------|-------------|
| raw_material_stock_id | Primary Key |
| raw_material_id | Raw Material Reference |
| current_quantity | Current Available Quantity |
| minimum_quantity | Minimum Inventory Threshold |
| last_updated_date | Latest Inventory Update |
| status | NORMAL / LOW_STOCK / OUT_OF_STOCK |
| notes | Remarks |
| created_at | Record Creation Timestamp |

---

# Relationship

```
RawMaterial
        │
        │ 1
        │
        │
        │
        │ 1
RawMaterialStock
```

Relationship Type

```
RawMaterial (1) -------- (1) RawMaterialStock
```

One raw material has exactly one stock record.

---

# Why One-to-One?

Each raw material should have only one current inventory position.

Example

```
Cement
Current Quantity = 520 Bags
```

We never maintain multiple inventory records for Cement.

Instead we update the same record.

---

# Why This Design?

This follows the ERP Inventory Pattern

Transaction Tables

- Purchase
- PurchaseItem
- Production

↓

Inventory Position Table

```
RawMaterialStock
```

The position table stores only the latest balance.

---

# Entity Layer

## File

```
RawMaterialStock.java
```

---

## Responsibilities

The Entity represents one row inside the database.

Responsibilities include

- Object Mapping
- Relationship Mapping
- Column Mapping
- Timestamp Management

---

## Important Mapping

### Primary Key

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
```

Uses PostgreSQL SERIAL.

---

### One-to-One Relationship

```java
@OneToOne
@JoinColumn(name="raw_material_id")
private RawMaterial rawMaterial;
```

Reason

One stock record belongs to exactly one raw material.

---

### Dates

```
LocalDate
```

Used for

- lastUpdatedDate

---

### Timestamp

```
LocalDateTime
```

Used for

- createdAt

Automatically populated using

```java
@PrePersist
```

---

# Repository Layer

## File

```
RawMaterialStockRepository.java
```

---

## Responsibilities

Provides direct communication with PostgreSQL.

Uses

```java
JpaRepository
```

Automatically provides

- save()
- findAll()
- findById()
- deleteById()

No SQL writing required.

---

# Service Layer

## File

```
RawMaterialStockService.java
```

---

## Responsibilities

Business Logic Layer

Responsibilities

- Fetch Inventory
- Save Inventory
- Update Inventory
- Delete Inventory

Acts between

Controller

↓

Repository

---

Current Methods

```
getAllRawMaterialStock()

saveRawMaterialStock()

getRawMaterialStockById()

deleteRawMaterialStock()
```

---

Future Business Logic

Later this service will perform

- Increase Stock
- Reduce Stock
- Low Stock Validation
- Auto Status Update
- Inventory Adjustment

---

# Controller Layer

## File

```
RawMaterialStockController.java
```

---

## Responsibilities

REST API Layer

Provides HTTP endpoints

---

Endpoints

### GET ALL

```
GET

/api/raw-material-stock
```

Returns

All inventory records

---

### GET BY ID

```
GET

/api/raw-material-stock/{id}
```

Returns

Single inventory record

---

### CREATE

```
POST

/api/raw-material-stock
```

Creates inventory record

Returns

201 CREATED

---

### UPDATE

```
PUT

/api/raw-material-stock/{id}
```

Updates inventory

Returns

200 OK

---

### DELETE

```
DELETE

/api/raw-material-stock/{id}
```

Deletes inventory

Returns

204 NO CONTENT

---

# CRUD Testing (Postman)

## CREATE

```
POST

/api/raw-material-stock
```

Sample Body

```json
{
  "rawMaterial": {
    "rawMaterialId": 1
  },
  "currentQuantity": 500,
  "minimumQuantity": 100,
  "status": "NORMAL",
  "notes": "Initial Stock"
}
```

---

## GET ALL

```
GET

/api/raw-material-stock
```

---

## GET BY ID

```
GET

/api/raw-material-stock/1
```

---

## UPDATE

```
PUT

/api/raw-material-stock/1
```

Sample

```json
{
  "rawMaterial": {
    "rawMaterialId": 1
  },
  "currentQuantity": 450,
  "minimumQuantity": 100,
  "status": "NORMAL",
  "notes": "Updated after production"
}
```

---

## DELETE

```
DELETE

/api/raw-material-stock/1
```

---

# Architect Observations

## Observation 1

Inventory Position is separated from Transaction History.

This is a standard ERP practice.

---

## Observation 2

One-to-One mapping avoids duplicate inventory records.

---

## Observation 3

Inventory values should never be manually calculated by users.

They should always be updated through business operations.

---

## Observation 4

The service layer should become the only place where stock changes happen.

Controllers should never modify quantities directly.

---

## Observation 5

Status should eventually be computed automatically.

Example

```
Current Quantity <= Minimum Quantity

↓

LOW_STOCK
```

instead of relying on manual input.

---

# Design Decisions

## Decision 1

Used One-to-One relationship between

RawMaterial

↓

RawMaterialStock

Reason

One raw material has only one inventory balance.

---

## Decision 2

Used Position Table pattern instead of transaction table.

Reason

Fast inventory lookup.

---

## Decision 3

Separated business logic into Service Layer.

Reason

Maintain clean architecture.

---

## Decision 4

Used ResponseEntity for all REST APIs.

Reason

Enterprise REST standards.

---

## Decision 5

CreatedAt managed using

```java
@PrePersist
```

Reason

No dependency on frontend.

---

# Changes Made

- Implemented One-to-One relationship.
- Added automatic createdAt timestamp.
- Used LocalDate for inventory update date.
- Implemented enterprise CRUD structure.
- Standardized REST responses.

---

# Future Enhancements

## Inventory Automation

Automatically update inventory after

- Purchase
- Production
- Stock Adjustment

---

## Auto Status Engine

Automatically calculate

```
NORMAL

LOW_STOCK

OUT_OF_STOCK
```

based on quantity.

---

## Inventory Reports

Future APIs

```
GET /low-stock

GET /out-of-stock

GET /inventory-summary

GET /stock-alerts
```

---

## Dashboard Integration

Will provide

- Total Stock
- Low Stock Count
- Out of Stock Count
- Material Availability

---

## AI Integration

Future AI features

- Predict Cement Consumption
- Forecast Inventory
- Reorder Suggestions
- Purchase Planning
- Inventory Trend Analysis

---

# Module Completion Checklist

| Component | Status |
|------------|--------|
| PostgreSQL Table | ✅ |
| Entity | ✅ |
| Repository | ✅ |
| Service | ✅ |
| Controller | ✅ |
| CRUD APIs | ✅ |
| Postman Testing | ✅ |
| pgAdmin Verification | ✅ |

---

# Final Architect Summary

The RawMaterialStock module follows a clean enterprise architecture by separating inventory position from transaction history.

The implementation follows:

- Spring Boot Best Practices
- JPA Standards
- PostgreSQL Standards
- Enterprise CRUD Pattern
- ERP Inventory Design Pattern

This module is now ready for integration with:

- Procurement
- Production
- Inventory Dashboard
- AI Inventory Forecasting

---

**Document Prepared By**

Harish Kamat

with ChatGPT