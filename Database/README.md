# Module 3 – Database Design

---

# Status

✅ Completed (Module Frozen)

---

# Objective

Design a business-driven, scalable, normalized, and implementation-ready database for the SKCP ERP system.

The database architecture mirrors the real-world operations of Shree Kundodari Cement Products and serves as the foundation for backend development.

---

# Deliverables

- Business Workflow Analysis
- Business Object Identification
- 19 Version 1 Database Tables
- Database Relationship Design (19 Validated Relationships)
- Master Entity Relationship Diagram (ERD)
- Database Data Dictionary
- Database Naming Standards
- Database Relationship Summary
- PostgreSQL Physical Schema Preparation

---

# Database Modules

## 1. Master Data

- Asset
- Customer
- Labour
- Product
- RawMaterial
- Supplier

---

## 2. Procurement

- Purchase
- PurchaseItem

---

## 3. Production

- Production
- Attendance

---

## 4. Inventory

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

## 5. Sales

- Order
- OrderItem
- Delivery
- DeliveryItem

---

## 6. Finance

- Payment
- PaymentAllocation

---

# Database Documents

| Document | Purpose |
|----------|---------|
| Database_Master_Index.md | Central navigation document |
| Database_Data_Dictionary.md | List of all Version 1 database tables |
| Database_Naming_Standards.md | Naming conventions used throughout the database |
| Database_Relationship_Summary.md | All validated relationships and business rules |
| Master_ER_Diagram.md | Logical Entity Relationship Diagram |
| PostgreSQL_Schema.sql | Physical SQL implementation (Phase 5) |

---

# Database Architecture Principles

The SKCP database follows these principles:

- Business-First Design
- Third Normal Form (3NF)
- Master–Transaction Separation
- Header–Detail Pattern
- Current Inventory + Historical Transactions
- Future-Ready Architecture
- Minimal Data Redundancy

---

# Current Statistics

| Category | Count |
|----------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Tables | **19** |

---

# Relationship Statistics

| Relationship Type | Count |
|-------------------|------:|
| One-to-One | 2 |
| One-to-Many | 17 |
| Total Validated Relationships | **19** |

---

# Module Progress

| Module | Status |
|---------|--------|
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | ✅ Completed |

---

# Next Module

➡ **Phase 5 – PostgreSQL Physical Database Schema**

This phase will convert the logical database design into:

- PostgreSQL Tables
- Primary Keys
- Foreign Keys
- Constraints
- Indexes
- SQL Scripts

After Phase 5, development will continue with:

➡ **Module 4 – Backend Development**

Technology Stack:

- PostgreSQL
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- JWT Authentication

---

# Version

**Version:** 2.0

**Status:** ✅ Module 3 Frozen

**Author:** Harish Kamat

**Last Updated:** 31 July 2026