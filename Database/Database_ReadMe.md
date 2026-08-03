# 🗄️ SKCP Database Module

> Module 3 – Database Design

---

# Overview

The **Database Module** is the foundation of the SKCP ERP System.

It transforms real-world business operations into a structured, normalized PostgreSQL database that serves as the single source of truth for the application.

The database has been designed using a **Business-First** and **Architecture-First** approach.

Instead of starting with tables, the design started from understanding how the business actually works.

---

# Module Information

| Item | Value |
|------|-------|
| Project | SKCP – Shree Kundodari Cement Products |
| Module | Module 3 – Database Design |
| Version | 1.0 |
| Status | ✅ Completed (Frozen) |
| Database | PostgreSQL |
| Author | Harish Kamat |
| Last Updated | 02-Aug-2026 |

---

# Design Philosophy

The database was designed using the following workflow:

Business Understanding

↓

Business Domains

↓

Business Objects

↓

Business Rules

↓

Entity Identification

↓

Relationship Design

↓

Normalization

↓

Physical PostgreSQL Schema

↓

Spring Boot Entity Mapping

---

# Business Domains

The database is organized into six business domains.

| Domain | Purpose |
|---------|----------|
| Master Data | Permanent business entities |
| Procurement | Supplier purchases and raw material procurement |
| Production | Manufacturing operations |
| Inventory | Current stock management |
| Sales | Customer orders and deliveries |
| Finance | Customer payments and payment allocation |

---

# Version 1 Database

## Master Tables (6)

- Customer
- Supplier
- Product
- RawMaterial
- Labour
- Asset

---

## Transaction Tables (10)

- Purchase
- PurchaseItem
- Attendance
- Production
- Order
- OrderItem
- Delivery
- DeliveryItem
- Payment
- PaymentAllocation

---

## Inventory Tables (3)

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

## Total Tables

**19 Tables**

---

# Database Statistics

| Item | Count |
|------|------:|
| Business Domains | 6 |
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Tables | 19 |

---

# Inventory Flow

Supplier

↓

Purchase

↓

Raw Material Stock

↓

Production

↓

Curing Stock

↓

Finished Goods Stock

↓

Delivery

↓

Customer

---

# Sales Flow

Customer

↓

Order

↓

Order Item

↓

Delivery

↓

Delivery Item

↓

Payment

↓

Payment Allocation

---

# Procurement Flow

Supplier

↓

Purchase

↓

Purchase Item

↓

Raw Material Stock

---

# Production Flow

Asset

↓

Production

↓

Labour

↓

Attendance

↓

Finished Goods

---

# Finance Flow

Customer

↓

Payment

↓

Payment Allocation

↓

Order

---

# Database Design Principles

The database follows these engineering principles:

- Business-First Design
- Third Normal Form (3NF)
- Single Responsibility Principle
- Single Source of Truth
- Header–Detail Pattern
- Parent–Child Relationships
- Audit-Friendly Design
- Future AI Compatibility

---

# Naming Standards

The project follows PostgreSQL naming conventions.

### Tables

- singular
- lowercase
- snake_case

Example

customer

purchase_item

finished_goods_stock

---

### Columns

- snake_case

Example

customer_name

order_date

current_quantity

---

### Primary Keys

Every table contains

```
*_id
```

Example

customer_id

supplier_id

production_id

---

### Foreign Keys

Use the referenced table's primary key.

Example

customer_id

supplier_id

product_id

---

### Audit Columns

Every table includes

```
created_at
```

Future versions may include:

- updated_at
- created_by
- updated_by

---

# Folder Contents

```
Database/

├── Database_Data_Dictionary.md
├── Database_Master_Index.md
├── Database_Naming_Standards.md
├── Database_Relationship_Summary.md
├── Master_ER_Diagram.md
├── PostgreSQL_Schema.sql
├── Seed_Data.sql
├── ER_Diagram.png
└── README.md
```

---

# Current Completion

| Phase | Status |
|------|--------|
| Business Objects | ✅ |
| Table Design | ✅ |
| Relationships | ✅ |
| ER Diagram | ✅ |
| Naming Standards | ✅ |
| PostgreSQL Schema | ✅ |
| Documentation | ✅ |

---

# Next Module

Module 4 – Backend Development

The following will be implemented:

- Spring Boot Project
- JPA Entity Classes
- Repositories
- Services
- REST APIs
- PostgreSQL Integration

---

# Future Enhancements (Version 2+)

The following tables/features have been intentionally deferred:

- Delivery Confirmation
- Machine Maintenance History
- Production Planning
- Warehouse Management
- Payroll
- GPS Tracking
- AI Forecasting
- Batch Traceability
- Reserved Stock

---

# Learning Outcome

Module 3 was not only about creating tables.

It covered:

- Business Analysis
- Data Modeling
- Normalization
- Relationship Design
- PostgreSQL
- Database Architecture
- Documentation Standards
- Engineering Best Practices

The database is now production-ready and serves as the foundation for all future backend and frontend development.

---

# Architect Approval

✅ Module 3 – Database Design

Status: **Completed and Frozen**

The database architecture is now ready for:

- Spring Boot Entity Classes
- Repository Layer
- Service Layer
- REST APIs
- PostgreSQL Implementation
- AI Integration

---

**Architect Verdict**

A production-quality database has been successfully designed using business-first principles.

The SKCP project now has a strong, scalable, and maintainable data foundation that supports future enterprise-grade development.