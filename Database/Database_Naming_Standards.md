# Database Naming Standards

---

# Module

**Module 3 – Database Design**

**Status:** ✅ Completed & Frozen (Version 1)

**Version:** 1.1

**Last Updated:** 02-Aug-2026

---

# Purpose

This document defines the naming conventions followed throughout the SKCP PostgreSQL database.

Consistent naming standards improve:

- Readability
- Maintainability
- Spring Boot JPA Mapping
- SQL Consistency
- Future scalability

These standards are followed across:

- PostgreSQL
- Spring Boot
- REST APIs
- Frontend
- Documentation

---

# PostgreSQL Naming Convention

SKCP follows PostgreSQL best practices.

Everything is written in:

- lowercase
- snake_case

Example

```
customer
customer_name
mobile_number
created_at
```

NOT

```
Customer
CustomerName
CreatedDate
```

---

# Table Naming

## Rules

- Use singular table names.
- Use lowercase.
- Use snake_case when multiple words exist.
- Use meaningful business terminology.
- Avoid abbreviations.

Examples

```
customer
supplier
product
raw_material
purchase
purchase_item
production
attendance
raw_material_stock
curing_stock
finished_goods_stock
order
order_item
delivery
delivery_item
payment
payment_allocation
asset
labour
```

---

# Column Naming

## Rules

- lowercase
- snake_case
- Business meaningful
- No abbreviations

Examples

```
customer_name
supplier_name
raw_material_id
created_at
order_date
payment_mode
```

---

# Primary Keys

## Rule

Every table has exactly one primary key.

Format

```
<table_name>_id
```

Examples

```
customer_id
supplier_id
product_id
purchase_id
payment_id
asset_id
labour_id
```

---

# Foreign Keys

## Rule

Foreign keys always use the referenced table name.

Format

```
<parent_table>_id
```

Examples

```
customer_id
supplier_id
product_id
purchase_id
order_id
delivery_id
raw_material_id
asset_id
labour_id
```

---

# Audit Columns

Every table should include

```
created_at
```

Future versions may include

```
updated_at
created_by
updated_by
deleted_at
deleted_by
```

---

# Status Columns

Status columns use

```
status
```

Allowed values depend on business rules.

Examples

Customer

```
ACTIVE
INACTIVE
```

Order

```
PENDING
PARTIAL
COMPLETED
CANCELLED
```

Delivery

```
PENDING
IN_TRANSIT
DELIVERED
```

Asset

```
ACTIVE
MAINTENANCE
OUT_OF_SERVICE
```

---

# Date Columns

Use descriptive names.

Examples

```
order_date
purchase_date
delivery_date
joining_date
attendance_date
production_date
expected_delivery_date
created_at
```

---

# Quantity Columns

Use descriptive business names.

Examples

```
ordered_quantity
current_quantity
minimum_quantity
quantity_produced
delivered_quantity
```

---

# Amount Columns

Financial values end with

```
amount
```

Examples

```
line_amount
allocated_amount
transport_cost
daily_rate
unit_price
```

Derived values should be calculated whenever possible instead of stored.

Example

Pending Amount

❌ Do not store

✅ Calculate

---

# Text Columns

Examples

```
customer_name
supplier_name
product_name
material_name
contact_person
remarks
address
phone
gst_number
```

---

# Constraint Naming

Primary Key

```
pk_customer
pk_supplier
```

Foreign Key

```
fk_order_customer
fk_purchase_supplier
fk_purchase_item_raw_material
```

Unique Constraint

```
uq_customer_mobile
uq_supplier_gst_number
```

Index

```
idx_customer_name
idx_order_date
idx_payment_date
```

---

# Reserved Words

Avoid SQL reserved keywords.

Avoid

```
user
group
order
date
```

Prefer

```
customer
customer_order
order_date
created_at
```

---

# Documentation Rule

Every table review document must include:

- Business Purpose
- Architecture Review
- PostgreSQL Physical Table
- SQL Explanation
- Business Rules
- Validation Checklist
- Architect Approval
- Lesson Summary

---

# Naming Philosophy

Business

↓

Business Objects

↓

PostgreSQL Tables

↓

Spring Boot Entities

↓

REST APIs

↓

Frontend

The same business terminology should be used across every layer.

---

# Current Standards

| Standard | Convention |
|-----------|------------|
| Tables | lowercase, snake_case |
| Columns | lowercase, snake_case |
| Primary Keys | table_name_id |
| Foreign Keys | parent_table_id |
| Audit Columns | created_at |
| Constraints | pk_, fk_, uq_ |
| Indexes | idx_ |

---

# Architect Notes

Why snake_case?

- PostgreSQL standard
- Easier SQL writing
- Better compatibility with Spring Boot and Hibernate
- No quoted identifiers required

Why lowercase?

PostgreSQL automatically converts unquoted identifiers to lowercase.

Using lowercase avoids unnecessary double quotes.

---

# Status

| Item | Status |
|------|--------|
| Module | Module 3 – Database Design |
| Version | 1.1 |
| Status | ✅ Completed & Frozen |
| Last Updated | 02-Aug-2026 |
| Next Module | Module 4 – Spring Boot Backend |
| Author | Harish Kamat |

---

# Architect Verdict

These naming standards are now frozen for Version 1.

Every future PostgreSQL table, Spring Boot entity, repository, service, and REST API should follow these conventions to maintain consistency across the entire SKCP system.