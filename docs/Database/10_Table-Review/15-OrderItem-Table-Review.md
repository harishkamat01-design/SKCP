# Table Review 15 — Order Item

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Order Item

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Order Item table stores the individual products included in a customer order.

This is a **Transaction Detail Table**.

It represents the business event:

**Products added to a customer order.**

It belongs to the parent:

- Order

It references:

- Product

Each record represents **one product inside one order**.

---

## Business Owner

Sales Domain

---

## Table Type

Transaction Detail Table

---

## Primary Key

OrderItemID

### Purpose

Uniquely identifies every product entry inside an order.

---

## Foreign Keys

### OrderID

References the parent Order.

Relationship:

Order

↓

Order Item

---

### ProductID

References the Product table.

Relationship:

Product

↓

Order Item

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
-- Table : order_item
-- Domain: Sales
-- Purpose: Stores products included in a customer order
-- ==========================================================

CREATE TABLE order_item
(
    order_item_id SERIAL PRIMARY KEY,

    order_id INT NOT NULL,

    product_id INT NOT NULL,

    ordered_quantity INT NOT NULL
        CHECK (ordered_quantity > 0),

    unit_selling_price DECIMAL(12,2) NOT NULL
        CHECK (unit_selling_price >= 0),

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orderitem_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id),

    CONSTRAINT fk_orderitem_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE order_item
```

### SQL Syntax

Creates a table named **order_item**.

### Database Concept

Stores detailed records belonging to another transaction.

### SKCP Context

Stores every product included in a customer order.

---

## Line 2

```sql
order_item_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates a unique ID.

### Database Concept

Primary Key uniquely identifies every order item.

### SKCP Context

Every product line inside an order has its own unique ID.

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

Every order item belongs to one order.

Relationship:

Order

↓

Order Item

---

### Foreign Key

```sql
FOREIGN KEY (order_id)
REFERENCES orders(order_id)
```

### SQL Syntax

Links Order Item to Order.

### Database Concept

Maintains Referential Integrity.

### SKCP Context

A product cannot exist without its parent order.

---

## Line 4

```sql
product_id INT NOT NULL
```

### SQL Syntax

Stores the Product ID.

### Database Concept

Foreign Key reference.

### SKCP Context

Identifies which cement block was ordered.

---

### Foreign Key

```sql
FOREIGN KEY (product_id)
REFERENCES product(product_id)
```

### SQL Syntax

Links Order Item to Product.

### Database Concept

Ensures only valid products can be ordered.

### SKCP Context

Customer can purchase:

- 4" Block
- 6" Block
- 8" Block

---

## Line 5

```sql
ordered_quantity INT NOT NULL
CHECK (ordered_quantity > 0)
```

### SQL Syntax

Stores the quantity ordered.

CHECK prevents zero or negative quantities.

### Database Concept

Protects business data integrity.

### SKCP Context

An order must contain at least one block.

---

## Line 6

```sql
unit_selling_price DECIMAL(12,2)
```

### SQL Syntax

Stores selling price per block.

### Database Concept

Stores the price applicable at the time of sale.

### SKCP Context

Price history remains preserved even if product prices change later.

---

## Line 7

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Flexible information field.

### SKCP Context

Examples:

Customer requested separate packing

Damaged blocks replaced

Special instructions

---

## Line 8

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores creation date and time.

### Database Concept

Audit column.

### SKCP Context

Useful for:

- Reports
- Audit
- Debugging
- AI analysis

---

# Step 4 — Architect Notes

### Why separate Order and Order Item?

One customer order may contain many products.

Example:

Order #105

↓

4" Block

↓

6" Block

↓

8" Block

This is a classic **One-to-Many relationship**.

---

### Why store Unit Selling Price here?

Product prices can change in the future.

The Order Item must preserve the selling price that was agreed at the time of sale.

Historical invoices remain accurate.

---

### Why no Total Amount column?

Total Amount is a derived value.

It can always be calculated as:

Ordered Quantity × Unit Selling Price

Avoid storing derived values unless necessary.

---

### Why Transaction Detail Table?

This table records the detailed items belonging to a business transaction.

It is dependent on the parent Order.

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

## Order Item Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (OrderItem.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Foreign Key relationships with Order and Product

---

# 📘 Lesson Summary

Today you learned:

- What a Transaction Detail Table is
- Difference between Order and Order Item
- One-to-Many relationships
- Why selling price belongs in Order Item
- Why derived values should not be stored
- How multiple products belong to one order

---

## Architect Verdict

Excellent.

The combination of **Order** and **Order Item** now models the Sales module using the same architecture employed by professional ERP systems.

This pattern is reusable for:

- Purchase → Purchase Item
- Delivery → Delivery Item
- Payment → Payment Allocation

meaning you've now mastered one of the most important ERP database design patterns.