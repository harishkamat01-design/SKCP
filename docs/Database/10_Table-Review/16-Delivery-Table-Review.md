# Table Review 16 — Delivery

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Delivery

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Delivery table stores the logistics information for dispatching customer orders.

This is a **Transaction Header Table**.

It represents the business event:

**Products dispatched to the customer.**

It acts as the parent for:

- Delivery Item

It references:

- Order

The Delivery table stores only delivery-level information.

Individual delivered products are stored separately in **Delivery Item**.

---

## Business Owner

Sales Domain

---

## Table Type

Transaction Header Table

---

## Primary Key

DeliveryID

### Purpose

Uniquely identifies every delivery.

---

## Foreign Key

OrderID

### Purpose

Identifies which customer order is being delivered.

Relationship:

Order

↓

Delivery

---

## Architecture Validation

| Check | Status |
|--------|--------|
| Business Driven | ✅ |
| Single Responsibility | ✅ |
| Normalized | ✅ |
| Future Ready | ✅ |
| Business Rules Covered | ✅ |

---

## Architect Verdict

Approved without structural changes.

---

# Step 2 — PostgreSQL Physical Table

```sql
-- ==========================================================
-- Table : delivery
-- Domain: Sales
-- Purpose: Stores customer delivery header information
-- ==========================================================

CREATE TABLE delivery
(
    delivery_id SERIAL PRIMARY KEY,

    order_id INT NOT NULL,

    delivery_date DATE NOT NULL,

    trip_number INT NOT NULL
        CHECK (trip_number > 0),

    total_trips INT NOT NULL
        CHECK (total_trips > 0),

    vehicle_type VARCHAR(50),

    vehicle_number VARCHAR(20),

    driver_name VARCHAR(100),

    transport_mode VARCHAR(20)
        NOT NULL
        CHECK
        (
            transport_mode IN
            (
                'CUSTOMER_ARRANGED',
                'FACTORY_ARRANGED',
                'THIRD_PARTY'
            )
        ),

    transport_cost DECIMAL(12,2)
        DEFAULT 0
        CHECK (transport_cost >= 0),

    delivery_status VARCHAR(20)
        NOT NULL
        DEFAULT 'PENDING'
        CHECK
        (
            delivery_status IN
            (
                'PENDING',
                'IN_TRANSIT',
                'DELIVERED'
            )
        ),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_delivery_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE delivery
```

### SQL Syntax

Creates a table named **delivery**.

### Database Concept

Stores delivery transactions.

### SKCP Context

Stores every dispatch made to customers.

---

## Line 2

```sql
delivery_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates a unique Delivery ID.

### Database Concept

Every delivery must have a unique identifier.

### SKCP Context

Each delivery receives its own Delivery ID.

---

## Line 3

```sql
order_id INT NOT NULL
```

### SQL Syntax

Stores the parent Order ID.

### Database Concept

Foreign Key reference.

### SKCP Context

Every delivery belongs to one customer order.

Relationship:

Order

↓

Delivery

---

### Foreign Key

```sql
FOREIGN KEY (order_id)
REFERENCES orders(order_id)
```

### SQL Syntax

Links Delivery to Order.

### Database Concept

Ensures a delivery cannot exist without a valid order.

### SKCP Context

Products are always delivered against an order.

---

## Line 4

```sql
delivery_date DATE NOT NULL
```

### SQL Syntax

Stores the dispatch date.

### Database Concept

Every delivery has a business transaction date.

### SKCP Context

Used for daily delivery reports.

---

## Line 5

```sql
trip_number INT
```

### SQL Syntax

Stores the current trip number.

### Database Concept

Supports partial deliveries.

### SKCP Context

Example:

Trip 1 of 3

Trip 2 of 3

Trip 3 of 3

---

## Line 6

```sql
total_trips INT
```

### SQL Syntax

Stores total planned trips.

### Database Concept

Allows delivery progress tracking.

### SKCP Context

Large orders may require multiple vehicle trips.

---

## Line 7

```sql
vehicle_type VARCHAR(50)
```

### SQL Syntax

Stores vehicle category.

### Database Concept

Descriptive business information.

### SKCP Context

Examples:

Bajaj ACE

Tractor

Truck

Mini Truck

---

## Line 8

```sql
vehicle_number VARCHAR(20)
```

### SQL Syntax

Stores registration number.

### Database Concept

Vehicle identification.

### SKCP Context

Useful for transport records.

---

## Line 9

```sql
driver_name VARCHAR(100)
```

### SQL Syntax

Stores driver's name.

### Database Concept

Tracks delivery responsibility.

### SKCP Context

Useful for follow-up and disputes.

---

## Line 10

```sql
transport_mode
```

Allowed values:

- CUSTOMER_ARRANGED
- FACTORY_ARRANGED
- THIRD_PARTY

### SQL Syntax

Uses CHECK constraint.

### Database Concept

Restricts values.

### SKCP Context

Defines who arranged transportation.

---

## Line 11

```sql
transport_cost DECIMAL(12,2)
```

### SQL Syntax

Stores transportation charges.

### Database Concept

Supports financial reporting.

### SKCP Context

Transport cost is calculated separately from product value.

---

## Line 12

```sql
delivery_status
```

Allowed values:

- PENDING
- IN_TRANSIT
- DELIVERED

### SQL Syntax

Uses CHECK constraint.

### Database Concept

Tracks delivery lifecycle.

### SKCP Context

Shows delivery progress.

---

## Line 13

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Flexible business information.

### SKCP Context

Examples:

Customer unavailable

Rain delay

Night delivery

---

## Line 14

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically records creation time.

### Database Concept

Audit column.

### SKCP Context

Useful for reports, audit, debugging and AI.

---

# Step 4 — Architect Notes

### Why separate Delivery and Delivery Item?

One delivery may contain multiple products.

Example:

Delivery

↓

4" Block

↓

6" Block

↓

8" Block

This creates a proper Header–Detail architecture.

---

### Why store Trip Number?

Large orders often require multiple trips.

The system can track delivery completion accurately.

---

### Why store Transport Mode?

The business currently uses:

- Customer Arranged
- Factory Arranged
- Third Party

Future reports can analyze transport methods.

---

### Why Transaction Header?

This table stores only delivery-level information.

Products belong in Delivery Item.

---

# Step 5 — Validation Checklist

| Validation | Status |
|------------|--------|
| Business Rule Verified | ✅ |
| Naming Convention | ✅ |
| PostgreSQL Compatible | ✅ |
| Normalized | ✅ |
| Data Integrity | ✅ |
| Future Ready | ✅ |
| Spring Boot Friendly | ✅ |

---

# Step 6 — Architect Approval

## Delivery Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (Delivery.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Foreign Key relationship with Order
- ✅ Parent table for Delivery Item

---

# 📘 Lesson Summary

Today you learned:

- What a Delivery Header table is
- Difference between Order and Delivery
- How logistics information is separated from product details
- Why multiple trips are stored
- Why delivery status is tracked independently
- Header–Detail pattern in ERP systems

---

## Architect Verdict

Excellent.

The **Delivery** table completes another major ERP transaction pattern.

You now have:

Customer → Order → Delivery

Next, **Delivery Item** will complete the logistics module using the same Header–Detail architecture you've already mastered.