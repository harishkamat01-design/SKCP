# Table Review 08 — PurchaseItem

---

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

PurchaseItem

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The PurchaseItem table stores the individual raw materials purchased within a Purchase transaction.

This is a **Transaction Detail Table**.

It acts as the child of:

- Purchase
- RawMaterial

Each Purchase may contain multiple raw materials.

Each PurchaseItem represents one purchased material.

---

## Business Owner

Procurement Domain

---

## Table Type

Transaction Detail Table

---

## Primary Key

PurchaseItemID

### Purpose

Uniquely identifies every purchase item.

No two purchase items can share the same PurchaseItemID.

---

## Foreign Keys

### PurchaseID

Identifies the Purchase to which this item belongs.

### RawMaterialID

Identifies which raw material was purchased.

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
-- Table : purchase_item
-- Domain: Procurement
-- Purpose: Stores individual raw materials within a purchase
-- ==========================================================

CREATE TABLE purchase_item
(
    purchase_item_id SERIAL PRIMARY KEY,

    purchase_id INT NOT NULL,

    raw_material_id INT NOT NULL,

    quantity DECIMAL(10,2) NOT NULL,

    unit VARCHAR(30) NOT NULL,

    unit_price DECIMAL(12,2) NOT NULL,

    line_amount DECIMAL(12,2) NOT NULL,

    remarks TEXT,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchase_item_purchase
        FOREIGN KEY (purchase_id)
        REFERENCES purchase(purchase_id),

    CONSTRAINT fk_purchase_item_raw_material
        FOREIGN KEY (raw_material_id)
        REFERENCES raw_material(raw_material_id)
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE purchase_item
```

### SQL Syntax

Creates a new table named **purchase_item**.

### Database Concept

Stores detailed records related to a parent transaction.

### SKCP Context

Stores every raw material purchased within a purchase.

---

## Line 2

```sql
purchase_item_id SERIAL PRIMARY KEY
```

### SQL Syntax

Automatically generates a unique ID.

### Database Concept

Every detail record requires its own identifier.

### SKCP Context

Each purchased material gets its own Purchase Item ID.

---

## Line 3

```sql
purchase_id INT NOT NULL
```

### SQL Syntax

Stores the Purchase ID.

Mandatory.

### Database Concept

Foreign Key to the Purchase table.

### SKCP Context

Indicates which Purchase this item belongs to.

---

## Line 4

```sql
raw_material_id INT NOT NULL
```

### SQL Syntax

Stores the Raw Material ID.

Mandatory.

### Database Concept

Foreign Key to the RawMaterial table.

### SKCP Context

Identifies which raw material was purchased.

Examples:

- Cement
- Sand
- Fly Ash
- Jelly

---

## Line 5

```sql
quantity DECIMAL(10,2) NOT NULL
```

### SQL Syntax

Stores purchased quantity.

### Database Concept

Uses DECIMAL because quantities may include fractions.

### SKCP Context

Examples:

- 50 Bags
- 2.5 Tractor Loads
- 1 Truck

---

## Line 6

```sql
unit VARCHAR(30) NOT NULL
```

### SQL Syntax

Stores measurement unit.

### Database Concept

Text field because units are descriptive.

### SKCP Context

Examples:

- Bag
- Tractor
- Truck
- Goods Vehicle

---

## Line 7

```sql
unit_price DECIMAL(12,2) NOT NULL
```

### SQL Syntax

Stores price per purchase unit.

### Database Concept

DECIMAL ensures financial accuracy.

### SKCP Context

Examples:

₹420 per Bag

₹3500 per Tractor

---

## Line 8

```sql
line_amount DECIMAL(12,2) NOT NULL
```

### SQL Syntax

Stores total amount for this line.

Formula:

Quantity × Unit Price

### Database Concept

Stores transaction value for faster reporting.

### SKCP Context

Example:

50 Bags

×

₹420

=

₹21,000

---

## Line 9

```sql
remarks TEXT
```

### SQL Syntax

Stores optional notes.

### Database Concept

Flexible descriptive field.

### SKCP Context

Examples:

- Wet Sand
- Premium Cement
- Urgent Purchase

---

## Line 10

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
- AI
- Debugging

---

## Line 11

```sql
CONSTRAINT fk_purchase_item_purchase
FOREIGN KEY (purchase_id)
REFERENCES purchase(purchase_id)
```

### SQL Syntax

Creates a Foreign Key.

### Database Concept

Every PurchaseItem must belong to an existing Purchase.

### SKCP Context

A PurchaseItem cannot exist independently.

---

## Line 12

```sql
CONSTRAINT fk_purchase_item_raw_material
FOREIGN KEY (raw_material_id)
REFERENCES raw_material(raw_material_id)
```

### SQL Syntax

Creates a Foreign Key.

### Database Concept

Every PurchaseItem must reference an existing Raw Material.

### SKCP Context

Prevents invalid material entries.

---

# Step 4 — Architect Notes

## Why do we need PurchaseItem?

Imagine one supplier invoice:

| Material | Qty |
|----------|-----|
| Cement | 100 Bags |
| Sand | 3 Tractor |
| Fly Ash | 2 Truck |

One Purchase

↓

Three Purchase Items

Instead of creating three Purchase records,

we create:

1 Purchase

+

3 Purchase Items

This is called the **Header–Detail Pattern**.

---

## Relationship

```text
Supplier
      │
      ▼
Purchase
      │
      ▼
PurchaseItem
      │
      ▼
RawMaterial
```

---

## Why LineAmount?

Although it can be calculated,

storing it improves:

- Report performance
- Invoice generation
- Historical accuracy

---

## Why two Foreign Keys?

PurchaseItem connects:

Purchase

AND

RawMaterial

This creates a bridge between the transaction and the material.

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

## PurchaseItem Table

🟢 **APPROVED**

Ready for:

- ✅ PostgreSQL Schema
- ✅ Spring Boot JPA Entity (PurchaseItem.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Foreign Key Relationships

---

# 📘 Lesson Summary

Today you additionally learned:

- Header–Detail Pattern
- Parent–Child Relationships
- Two Foreign Keys in one table
- Transaction Detail Tables
- Why ERP systems separate Purchase and PurchaseItem
- Why LineAmount is stored instead of calculated every time

---

## Architect Verdict

Excellent.

Purchase and PurchaseItem together form the **first complete ERP transaction module** in SKCP.

This same Header–Detail architecture will be reused for:

- Production → ProductionItem
- Order → OrderItem
- Delivery → DeliveryItem

Mastering this pattern means you've learned one of the most fundamental ERP database design concepts.