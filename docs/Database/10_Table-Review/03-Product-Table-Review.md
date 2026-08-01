# Table Review 03 — Product

## Module

Module 3 – Physical PostgreSQL Database Design

---

## Table Name

Product

---

## Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The Product table stores permanent information about all finished products manufactured and sold by SKCP.

This is a **Master Data** table.

It acts as the parent for:

- Production Item
- Order Item
- Delivery Item
- Finished Goods Stock

Product information should never be duplicated in transaction tables.

---

## Business Owner

Sales Domain

---

## Table Type

Master Table

---

## Primary Key

ProductID

### Purpose

Uniquely identifies every product.

No two products can share the same ProductID.

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

Approved with ProductCode enhancement for future scalability.

---

# Step 2 — PostgreSQL Physical Table

```sql
CREATE TABLE product
(
    product_id SERIAL PRIMARY KEY,

    product_code VARCHAR(20)
        NOT NULL
        UNIQUE,

    product_name VARCHAR(100)
        NOT NULL,

    size VARCHAR(10)
        NOT NULL,

    length DECIMAL(5,2)
        NOT NULL,

    width DECIMAL(5,2)
        NOT NULL,

    height DECIMAL(5,2)
        NOT NULL,

    unit VARCHAR(20)
        NOT NULL
        DEFAULT 'INCH',

    description TEXT,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);
```

---

# Step 3 — Three-Layer Explanation

## Line 1

```sql
CREATE TABLE product
```

### SQL Syntax

Creates a new table named **product**.

### Database Concept

A table stores records of one business entity.

### SKCP Context

Stores all cement block product variants manufactured by SKCP.

---

## Line 2

```sql
product_id SERIAL PRIMARY KEY
```

### SQL Syntax

- `SERIAL` automatically generates sequential numbers.
- `PRIMARY KEY` uniquely identifies every product.

### Database Concept

Every master table requires one unique identifier.

### SKCP Context

Each block type receives its own Product ID.

Example:

Product 1

Solid Block 4"

Product 2

Solid Block 6"

Product 3

Solid Block 8"

Future transaction tables will reference this ID.

---

## Line 3

```sql
product_code VARCHAR(20)
NOT NULL
UNIQUE
```

### SQL Syntax

Stores a short unique code.

Examples:

SB4

SB6

SB8

`UNIQUE` ensures that duplicate product codes cannot exist.

### Database Concept

Business codes provide human-friendly identifiers while the database continues using ProductID internally.

### SKCP Context

Your father can quickly identify products using simple codes instead of long names.

These codes will appear on:

- Quotations
- Invoices
- Delivery Challans
- Stock Reports

---

## Line 4

```sql
product_name VARCHAR(100)
NOT NULL
```

### SQL Syntax

Stores the full product name.

Maximum length: 100 characters.

Cannot be NULL.

### Database Concept

Every product must have a descriptive business name.

### SKCP Context

Example:

Solid Block

This is the official business name used throughout the system.

---

## Line 5

```sql
size VARCHAR(10)
NOT NULL
```

### SQL Syntax

Stores the business size.

Examples:

4"

6"

8"

### Database Concept

Stores the commercial classification of the product.

### SKCP Context

Customers usually ask for:

4 inch blocks

6 inch blocks

8 inch blocks

Keeping Size separately matches the language used in daily business.

---

## Line 6

```sql
length DECIMAL(5,2)
NOT NULL
```

### SQL Syntax

Stores product length.

DECIMAL allows whole numbers as well as decimal values.

Example:

16.00

### Database Concept

Dimensions should be stored as numeric values instead of text.

### SKCP Context

Although today's block length is 16 inches, future products may have different dimensions.

Using DECIMAL makes the system future-ready.

---

## Line 7

```sql
width DECIMAL(5,2)
NOT NULL
```

### SQL Syntax

Stores the product width.

DECIMAL allows whole numbers as well as decimal values.

Example:

8.00

### Database Concept

Width is stored as a numeric value so that calculations can be performed if required.

### SKCP Context

The standard width of all current cement blocks is **8 inches**.

Future products may have different widths, so storing it separately makes the design flexible.

---

## Line 8

```sql
height DECIMAL(5,2)
NOT NULL
```

### SQL Syntax

Stores the product height.

Example:

4.00

6.00

8.00

### Database Concept

Height is an independent product dimension.

Keeping dimensions separate avoids storing values like:

4 × 8 × 16

inside one text field.

### SKCP Context

Customers identify products by height:

- 4 inch block
- 6 inch block
- 8 inch block

Height is therefore an important business attribute.

---

## Line 9

```sql
unit VARCHAR(20)
NOT NULL
DEFAULT 'INCH'
```

### SQL Syntax

Stores the measurement unit.

Default value:

INCH

### Database Concept

The unit is separated from dimensions so that measurements remain standardized.

If required in future, units could become:

- CM
- MM
- FT

without changing the table structure.

### SKCP Context

SKCP currently measures block dimensions in **inches**.

The default ensures consistency across all products.

---

## Line 10

```sql
description TEXT
```

### SQL Syntax

Stores optional descriptive information.

TEXT allows long notes.

### Database Concept

Descriptions vary in length, making TEXT the most suitable data type.

### SKCP Context

Examples:

- Premium quality block
- High strength block
- Special order product

This field is optional.

---

## Line 11

```sql
status VARCHAR(10)
NOT NULL
DEFAULT 'ACTIVE'
CHECK (status IN ('ACTIVE', 'INACTIVE'))
```

### SQL Syntax

Default value:

ACTIVE

Allowed values:

- ACTIVE
- INACTIVE

The CHECK constraint ensures that no invalid status can be stored.

### Database Concept

Rather than deleting products, they are marked as inactive.

This preserves historical transaction data.

### SKCP Context

Suppose one block size is discontinued.

Instead of deleting it,

the product is marked:

INACTIVE

Old Orders and Deliveries continue to work correctly.

---

## Line 12

```sql
created_at TIMESTAMP
NOT NULL
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores the date and time when the product record is created.

### Database Concept

Every production database should maintain audit information.

This helps in:

- Tracking history
- Reporting
- Debugging
- Data auditing

### SKCP Context

Useful for:

- Product creation history
- Business reports
- AI analysis
- Audit trail

---

# Step 4 — Architect Notes

### Why use ProductCode?

Instead of repeatedly writing:

Solid Block 6" × 8" × 16"

the business can simply use:

SB6

Benefits:

- Faster data entry
- Cleaner invoices
- Easier reporting
- Future barcode support

---

### Why use DECIMAL for dimensions?

Although current values are whole numbers:

- 4
- 6
- 8
- 16

Future products may use:

- 4.5
- 7.25

Using DECIMAL now avoids future database changes.

---

### Why keep Size and Dimensions separately?

Size represents the business terminology.

Length, Width and Height represent engineering measurements.

Example:

Business says:

> 6 inch block

Engineering knows:

Length = 16

Width = 8

Height = 6

Both serve different purposes.

---

### Why no Foreign Keys?

Product is a Master Table.

It does not depend on any other table.

Instead,

these tables will reference Product:

Product

↓

Production Item

↓

Order Item

↓

Delivery Item

↓

Finished Goods Stock