# Table Review 17 — Delivery Item

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Delivery Item

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Delivery Item table stores the individual products delivered as part of a customer delivery.

This is a **Transaction Detail Table**.

It represents the business event:

**Products delivered to the customer.**

It belongs to the parent:

- Delivery

It references:

- Product

Each record represents **one product delivered during one delivery.**

---

## Business Owner

Sales Domain

---

## Table Type

Transaction Detail Table

---

## Primary Key

DeliveryItemID

### Purpose

Uniquely identifies every delivered product record.

---

## Foreign Keys

### DeliveryID

References the parent Delivery.

Relationship:

Delivery

↓

Delivery Item

---

### ProductID

References the Product table.

Relationship:

Product

↓

Delivery Item

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
-- Table : delivery_item
-- Domain: Sales
-- Purpose: Stores products delivered in each delivery
-- ==========================================================

CREATE TABLE delivery_item
(
    delivery_item_id SERIAL PRIMARY KEY,

    delivery_id INT NOT NULL,

    product_id INT NOT NULL,

    delivered_quantity INT NOT NULL
        CHECK (delivered_quantity > 0),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_deliveryitem_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES delivery(delivery_id),

    CONSTRAINT fk_deliveryitem_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE delivery_item
```

### SQL Syntax

Creates a table named **delivery_item**.

### Database Concept

Stores detailed records belonging to a delivery.

### SKCP Context

Stores every product dispatched to customers.

---

## Line 2

```sql
delivery_item_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates a unique Delivery Item ID.

### Database Concept

Every row requires a unique identifier.

### SKCP Context

Each delivered product line receives its own ID.

---

## Line 3

```sql
delivery_id INT NOT NULL
```

### SQL Syntax

Stores the parent Delivery ID.

### Database Concept

Foreign Key reference.

### SKCP Context

Every delivery item belongs to one delivery.

Relationship:

Delivery

↓

Delivery Item

---

### Foreign Key

```sql
FOREIGN KEY (delivery_id)
REFERENCES delivery(delivery_id)
```

### SQL Syntax

Links Delivery Item to Delivery.

### Database Concept

Ensures every delivery item belongs to an existing delivery.

### SKCP Context

Products cannot be delivered without a delivery record.

---

## Line 4

```sql
product_id INT NOT NULL
```

### SQL Syntax

Stores Product ID.

### Database Concept

Foreign Key reference.

### SKCP Context

Identifies which block size was delivered.

---

### Foreign Key

```sql
FOREIGN KEY (product_id)
REFERENCES product(product_id)
```

### SQL Syntax

Links Delivery Item to Product.

### Database Concept

Maintains Referential Integrity.

### SKCP Context

Only valid products can be delivered.

---

## Line 5

```sql
delivered_quantity INT NOT NULL
CHECK (delivered_quantity > 0)
```

### SQL Syntax

Stores quantity delivered.

CHECK prevents zero or negative values.

### Database Concept

Protects business data integrity.

### SKCP Context

A delivery must contain at least one block.

---

## Line 6

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Flexible business information.

### SKCP Context

Examples:

Broken blocks replaced

Partial delivery

Customer requested separate unloading

---

## Line 7

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores creation date and time.

### Database Concept

Audit information.

### SKCP Context

Useful for:

- Delivery reports
- Audit
- AI analysis
- Debugging

---

# Step 4 — Architect Notes

### Why separate Delivery and Delivery Item?

One delivery may contain multiple products.

Example:

Delivery #205

↓

4" Block

↓

6" Block

↓

8" Block

This creates a proper Header–Detail relationship.

---

### Why store Delivered Quantity?

Customer may order:

1000 blocks

but receive:

600 blocks

in Trip 1

and

400 blocks

in Trip 2.

Each delivery stores only the quantity delivered in that trip.

---

### Why no Selling Price here?

Selling price belongs to **Order Item**.

Delivery only records movement of goods.

This prevents duplicate business data.

---

### Why Transaction Detail Table?

Delivery Item records detailed logistics information belonging to a Delivery.

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

## Delivery Item Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (DeliveryItem.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Foreign Key relationships with Delivery and Product

---

# 📘 Lesson Summary

Today you learned:

- What a Delivery Detail table is
- Difference between Delivery and Delivery Item
- How ERP systems separate logistics headers from product details
- Why delivered quantity is stored independently
- Why selling price is **not** stored in Delivery Item
- Another example of the Header–Detail design pattern

---

## Architect Verdict

Excellent.

The **Delivery + Delivery Item** architecture now completes the Sales Logistics module.

You have successfully implemented another enterprise ERP pattern:

Order

↓

Order Item

↓

Delivery

↓

Delivery Item

This design is scalable, normalized, and ready for Spring Boot and PostgreSQL.