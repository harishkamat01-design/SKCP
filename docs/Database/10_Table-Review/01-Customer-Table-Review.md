# Table Review 01 — Customer


# Module

**Module 3 – Physical PostgreSQL Database Design**

---

# Table Name

**Customer**

---

# Status

🟢 Frozen Business Table

---

# Step 1 — Architecture Review

## Business Purpose

The **Customer** table stores permanent customer master information.

This is a **Master Data** table.

It acts as the parent for:

- Orders
- Payments

Customer information should never be duplicated in transaction tables.

---

## Business Owner

**Sales Domain**

---

## Table Type

**Master Table**

---

## Primary Key

**CustomerID**

### Purpose

Uniquely identifies every customer.

No two customers can share the same CustomerID.

---

## Architecture Validation

| Check | Status |
|---------|--------|
| Business Driven | ✅ |
| Single Responsibility | ✅ |
| Normalized | ✅ |
| Future Ready | ✅ |
| Business Rules Covered | ✅ |

---

## Architect Verdict

✅ Approved without structural changes.

---

# Step 2 — PostgreSQL Physical Table

```sql
CREATE TABLE customer (

    customer_id SERIAL PRIMARY KEY,

    customer_name VARCHAR(100) NOT NULL,

    mobile_number VARCHAR(15) NOT NULL,

    alternate_mobile VARCHAR(15),

    address TEXT,

    village VARCHAR(100),

    city VARCHAR(100),

    pincode VARCHAR(10),

    gst_number VARCHAR(20),

    remarks TEXT,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','INACTIVE')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);
```

---

# Step 3 — Three-Layer Explanation

---

## Line 1

```sql
CREATE TABLE customer
```

### SQL Syntax

Creates a new table named **customer**.

### Database Concept

A table stores rows of related information.

### SKCP Context

Stores permanent customer information.

---

## Line 2

```sql
customer_id SERIAL PRIMARY KEY
```

### SQL Syntax

**SERIAL**

Automatically generates numbers.

Example:

```
1
2
3
4
5
```

**PRIMARY KEY**

Makes every record unique.

### Database Concept

A Primary Key uniquely identifies every row.

- Cannot contain duplicates
- Cannot contain NULL values

### SKCP Context

Every customer receives a unique Customer ID.

Example:

Customer 1

Harish

Customer 2

Ramesh

Orders and Payments will reference this ID.

---

## Line 3

```sql
customer_name VARCHAR(100) NOT NULL
```

### SQL Syntax

Stores text.

Maximum length = 100 characters.

NOT NULL means the value is mandatory.

### Database Concept

A customer cannot exist without a name.

### SKCP Context

Your father always records the customer's name.

Therefore the database should require it.

---

## Line 4

```sql
mobile_number VARCHAR(15) NOT NULL
```

### SQL Syntax

Stores phone numbers.

Why VARCHAR instead of INTEGER?

Phone numbers are identifiers, not numbers.

Example:

```
9876543210
```

You never perform arithmetic on them.

They may also contain:

```
+91XXXXXXXXXX
09876543210
```

Hence VARCHAR.

### SKCP Context

Customer contact is mandatory.

---

## Line 5

```sql
alternate_mobile VARCHAR(15)
```

### SQL Syntax

Optional field.

NULL is allowed.

### Database Concept

Not every customer has two phone numbers.

### SKCP Context

Some customers provide an alternate contact.

---

## Line 6

```sql
address TEXT
```

### SQL Syntax

TEXT stores long text.

Unlike VARCHAR, PostgreSQL doesn't require a size.

### Database Concept

Addresses vary greatly in length.

TEXT is ideal.

### SKCP Context

Used for delivery reference.

---

## Line 7

```sql
village VARCHAR(100)
```

Stores village name.

Useful for delivery planning.

---

## Line 8

```sql
city VARCHAR(100)
```

Stores city.

Useful for reports and customer grouping.

---

## Line 9

```sql
pincode VARCHAR(10)
```

Stores postal code.

VARCHAR because:

```
581319
```

is not used for calculations.

---

## Line 10

```sql
gst_number VARCHAR(20)
```

Optional GST registration.

Business customers may provide GST.

Retail customers usually won't.

---

## Line 11

```sql
remarks TEXT
```

Stores notes.

Examples:

- Regular customer
- Pay after delivery
- VIP customer

---

## Line 12–15

```sql
status VARCHAR(10)
    NOT NULL
    DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE','INACTIVE'))
```

### SQL Syntax

Default:

```
ACTIVE
```

Allowed values:

- ACTIVE
- INACTIVE

Nothing else.

### Database Concept

The CHECK Constraint protects the database.

The database itself rejects invalid values.

### SKCP Context

Instead of deleting customers,

mark them as **INACTIVE**.

Historical Orders and Payments remain intact.

---

## Last Column

```sql
created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
```

### SQL Syntax

Automatically stores:

- Date
- Time

when the row is inserted.

### Database Concept

Every production database stores audit information.

### SKCP Context

Useful for:

- Customer growth reports
- Audit
- AI
- Debugging
- Record history

---

# Step 4 — Architect Notes

## Why use snake_case?

```
customer_name
```

instead of

```
CustomerName
```

Reason:

- PostgreSQL best practice
- Spring Boot JPA maps it cleanly

---

## Why use lowercase table names?

```
customer
```

instead of

```
Customer
```

Reason:

- Avoids quoted identifiers
- Simplifies SQL

---

## Why SERIAL?

For Version 1,

it's simple and efficient.

Future enterprise systems may use UUIDs,

but SERIAL is ideal for SKCP.

---

## Why no foreign keys?

Customer is a Master Table.

It doesn't depend on any other table.

Instead,

other tables reference Customer.

Example:

```
Customer
      │
      ▼
Order
      │
      ▼
Payment
```

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

## Customer Table

🟢 **APPROVED**

This table is now ready to be added to:

- ✅ PostgreSQL_Schema.sql
- ✅ Spring Boot JPA Entity (Customer.java)
- ✅ Repository Layer
- ✅ Service Layer
- ✅ REST APIs
- ✅ Future Foreign Key relationships (Order, Payment)

---

# 📘 Lesson Summary

Today you learned:

- CREATE TABLE
- SERIAL
- PRIMARY KEY
- VARCHAR
- TEXT
- NOT NULL
- DEFAULT
- CHECK
- TIMESTAMP
- CURRENT_TIMESTAMP
- Why master tables don't have foreign keys
- Why audit columns (`created_at`) are important
- How to think like a Database Architect rather than just writing SQL

---

# Architect Verdict

Excellent start.

This is a production-quality master table and sets the standard for the remaining SKCP schema.