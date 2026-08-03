# Module 3 – Database Design

---

# Status

✅ Completed (Module Frozen)

---

# Objective

Design a business-driven, scalable, normalized, and implementation-ready PostgreSQL database for the SKCP ERP System.

The database architecture mirrors the real-world operations of **Shree Kundodari Cement Products (SKCP)** and serves as the foundation for backend development.

---

# Deliverables

- Business Workflow Analysis
- Business Object Identification
- 19 Version 1 Database Tables
- Database Relationship Design (19 Validated Relationships)
- Master Entity Relationship Diagram (ERD)
- PostgreSQL Physical Database Schema
- Database Data Dictionary
- Database Naming Standards
- Database Relationship Summary
- Architecture Decision Records (ADR)

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
| Database_Data_Dictionary.md | Complete table definitions |
| Database_Naming_Standards.md | Naming conventions |
| Database_Relationship_Summary.md | Business relationships and rules |
| Master_ER_Diagram.md | Logical ER Diagram |
| PostgreSQL_Schema.sql | PostgreSQL Physical Schema |
| ADR-DB-001-Header-Detail-Pattern.md | Header–Detail design decision |
| ADR-DB-002-Payment-Allocation-Bridge.md | Payment Allocation bridge design |
| ADR-DB-003-Current-Inventory-Model.md | Current Inventory architecture |
| ADR-DB-004-Master-Transaction-Separation.md | Master vs Transaction separation |

---

# Database Architecture Principles

The SKCP database follows:

- Business-First Database Design
- Third Normal Form (3NF)
- Master–Transaction Separation
- Header–Detail Pattern
- Current Inventory + Historical Transactions
- Business-Driven Relationships
- Minimal Data Redundancy
- Future-Ready ERP Architecture

---

# Database Statistics

| Category | Count |
|----------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| **Total Tables** | **19** |

---

# Relationship Statistics

| Relationship Type | Count |
|-------------------|------:|
| One-to-One | 3 |
| One-to-Many | 16 |
| **Total Validated Relationships** | **19** |

---

# Current Inventory Model

Current inventory is maintained separately from historical transactions.

Inventory Tables

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

Historical Transactions

- Purchase
- PurchaseItem
- Production
- Delivery
- DeliveryItem

This provides:

- Fast inventory lookup
- Complete audit trail
- Better reporting performance
- Future AI forecasting support

---

# Architecture Decision Records (ADR)

The database architecture is documented through Architecture Decision Records.

| ADR | Decision |
|------|----------|
| ADR-DB-001 | Header–Detail Pattern |
| ADR-DB-002 | Payment Allocation Bridge Table |
| ADR-DB-003 | Current Inventory Model |
| ADR-DB-004 | Master vs Transaction Separation |

These ADRs explain the reasoning behind major architectural decisions and ensure future maintainability.

---

# Module Progress

| Module | Status |
|---------|--------|
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | ✅ Completed (Frozen) |

---

# Next Module

➡ **Module 4 – Backend Development**

The validated database design will now be integrated with the backend.

Technology Stack

- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- PostgreSQL
- REST APIs
- JWT Authentication

The backend will use the finalized PostgreSQL schema as the single source of truth.

---

# Version

**Version:** 3.0

**Status:** ✅ Module 3 Frozen

**Author:** Harish Kamat

**Last Updated:** 31 July 2026