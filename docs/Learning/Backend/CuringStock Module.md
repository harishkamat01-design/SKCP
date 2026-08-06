# Curing Stock Module
## SKCP (Shree Kundodari Cement Products)

**Module:** Inventory

**Sub-Module:** Curing Stock

**Status:** ✅ Completed

**Author:** Harish Kamat

---

# Purpose

The Curing Stock module manages products that have been manufactured but are **not yet ready for sale**.

Immediately after Production, every manufactured batch enters the curing yard.

After the curing period completes, the batch is moved to Finished Goods Stock.

---

# Business Workflow

Production
↓
Curing Stock
↓
Finished Goods Stock
↓
Sales

This module represents the second stage of the manufacturing lifecycle.

---

# Business Rules

Every Production batch:

- Creates exactly one Curing Stock batch.
- Contains only one Product.
- Stores the quantity under curing.
- Records the production date.
- Automatically calculates the expected ready date.
- Starts with status `CURING`.
- Moves to `READY`.
- Finally moves to `MOVED` after transfer to Finished Goods Stock.

---

# Database Table

```sql
CREATE TABLE curing_stock
(
    curing_stock_id SERIAL PRIMARY KEY,

    production_id INT NOT NULL UNIQUE,

    product_id INT NOT NULL,

    quantity INT NOT NULL
        CHECK (quantity >= 0),

    production_date DATE NOT NULL,

    expected_ready_date DATE NOT NULL,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'CURING'
        CHECK (status IN ('CURING','READY','MOVED')),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_curing_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id),

    CONSTRAINT fk_curing_production
        FOREIGN KEY (production_id)
        REFERENCES production(production_id)
);
```

---

# Table Explanation

| Column | Purpose |
|---------|---------|
| curing_stock_id | Primary Key |
| production_id | Links to Production batch |
| product_id | Product being cured |
| quantity | Quantity under curing |
| production_date | Date manufactured |
| expected_ready_date | Date curing completes |
| status | CURING / READY / MOVED |
| remarks | Optional notes |
| created_at | Audit timestamp |

---

# Why ProductionID is UNIQUE?

One production batch should only create one curing batch.

Relationship:

```
Production

1 -------- 1

Curing Stock
```

This is enforced by

```
UNIQUE(production_id)
```

---

# Entity

Implemented:

```
CuringStock.java
```

Major relationships:

```
@OneToOne

Production
```

```
@ManyToOne

Product
```

Audit column:

```
createdAt

@PrePersist
```

---

# Repository

Implemented:

```
CuringStockRepository.java
```

Standard implementation:

```java
@Repository
public interface CuringStockRepository
extends JpaRepository<CuringStock,Integer>
{
}
```

No custom queries required for Version 1.

---

# Service

Implemented:

```
CuringStockService.java
```

CRUD methods:

- Get All
- Get By ID
- Save
- Delete

---

# Business Logic

This module introduces another important business rule.

Expected Ready Date is automatically calculated.

```
expectedReadyDate

=

productionDate

+

3 Days
```

Implementation:

```java
curingStock.setExpectedReadyDate(
        curingStock.getProductionDate().plusDays(3)
);
```

---

# Why not PostgreSQL Generated Column?

Although

```
Production Date + 3 Days
```

looks like a calculation,

it is actually a **Business Rule**.

Business rules belong inside the Service Layer.

Possible future changes:

- Summer → 2 Days
- Rainy Season → 5 Days
- Premium Product → 6 Days

Only one Java line changes.

No database migration required.

---

# Controller

Implemented:

```
CuringStockController.java
```

CRUD endpoints:

| Method | Endpoint |
|---------|----------|
| GET | /api/curing-stock |
| GET | /api/curing-stock/{id} |
| POST | /api/curing-stock |
| PUT | /api/curing-stock/{id} |
| DELETE | /api/curing-stock/{id} |

Uses:

- ResponseEntity
- Proper HTTP Status Codes
- Enterprise CRUD Pattern

---

# POST Request

```json
{
    "production": {
        "productionId": 1
    },
    "product": {
        "productId": 1
    },
    "quantity": 100,
    "productionDate": "2026-08-06",
    "status": "CURING",
    "remarks": "First curing batch"
}
```

Notice:

We never send

```
expectedReadyDate
```

The Service calculates it.

---

# Response

```json
{
    "productionDate":"2026-08-06",

    "expectedReadyDate":"2026-08-09"
}
```

Automatically generated.

---

# PUT Request

Update:

```
productionDate
```

Service automatically recalculates

```
expectedReadyDate
```

No manual calculation required.

---

# DELETE

Standard delete by ID.

Returns

```
204 No Content
```

---

# PostgreSQL Verification

Verify using

```sql
SELECT *
FROM curing_stock;
```

Expected

| Production Date | Expected Ready Date |
|-----------------|---------------------|
|2026-08-06|2026-08-09|

---

# Relationships

```
Production
      │
      │ One-to-One
      ▼
Curing Stock
      │
      │ Many-to-One
      ▼
Product
```

---

# Architectural Observations

This module introduced another important Service Layer responsibility.

Previous modules:

Customer

↓

Repository Save

Attendance

↓

Daily Amount Calculation

Purchase

↓

Business Validation

Curing Stock

↓

Business Date Calculation

The Service layer is gradually evolving from simple CRUD into the place where business rules live.

---

# Testing Completed

Successfully tested:

✅ POST

✅ GET ALL

✅ GET BY ID

✅ PUT

✅ DELETE

Verified:

- PostgreSQL
- Postman
- ResponseEntity
- HTTP Status Codes

---

# Lessons Learned

## Database Owns

- Primary Keys
- Foreign Keys
- Constraints
- Mathematical Generated Columns

Examples:

- total_cement_bags

---

## Service Owns

Business Rules

Examples:

- Expected Ready Date
- Attendance Amount
- Payment Allocation
- Inventory Movement

---

# Business Importance

The Curing Stock module prevents freshly manufactured blocks from being sold immediately.

Instead, it enforces the manufacturing lifecycle:

Production

↓

Curing

↓

Finished Goods

↓

Sales

This reflects the actual business process followed at SKCP.

---

# Module Status

✅ Database Table

✅ Entity

✅ Repository

✅ Service

✅ Controller

✅ CRUD APIs

✅ Postman Testing

✅ PostgreSQL Validation

✅ Business Rule Implementation

---

# Next Module

Finished Goods Stock

This will complete the manufacturing inventory flow:

Production

↓

Curing Stock

↓

Finished Goods Stock

↓

Sales

Once Finished Goods Stock is completed, the entire Production → Inventory pipeline will be fully implemented.

---

**Prepared By**

**Harish Kamat**

with ChatGPT (Architect)