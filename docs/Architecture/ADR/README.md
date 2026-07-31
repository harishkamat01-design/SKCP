# Database

# Module 3 – Database Design

---

## Status

✅ Completed

---

## Version

1.0

---

## Purpose

The Database module defines the complete logical database architecture for the SKCP (Shree Kundodari Cement Products) Business Management System.

It translates the business requirements gathered during Module 1 and the architecture decisions from Module 2 into a scalable relational database model.

The database follows a **Business-First** design approach where every table, attribute, and relationship represents an actual business process.

---

# Objectives

The database is designed to:

- Model the real manufacturing workflow
- Eliminate data duplication
- Maintain referential integrity
- Support future AI features
- Enable efficient reporting
- Provide a strong foundation for backend development

---

# Module Deliverables

Completed deliverables include:

- ✅ Database Data Dictionary
- ✅ Database Naming Standards
- ✅ Database Relationship Summary
- ✅ Master Entity Relationship Diagram
- ✅ Database Master Index
- ✅ 19 Version 1 Database Tables
- ✅ 19 Validated Relationships
- ✅ Architecture Decision Records (ADR)

---

# Business Domains

The database is organized into six business domains.

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

# Database Statistics

| Category | Count |
|----------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Tables | **19** |
| Validated Relationships | **19** |

---

# Architecture Principles

The SKCP database follows:

- Business-First Database Design
- Normalized Relational Design
- Master–Transaction Separation
- Header–Detail Pattern
- Current Inventory + Historical Transactions
- Referential Integrity
- Future-Ready Architecture

---

# Architecture Decision Records

The following ADRs document the major database design decisions.

| ADR | Description |
|------|-------------|
| ADR-DB-001 | Production references Asset |
| ADR-DB-002 | Payment Allocation Bridge Table |
| ADR-DB-003 | Current Inventory Model |
| ADR-DB-004 | Master–Transaction Separation |

---

# Repository Structure

```
Database/

├── Database_Master_Index.md
├── Database_Data_Dictionary.md
├── Database_Naming_Standards.md
├── Database_Relationship_Summary.md
├── Master_ER_Diagram.md
├── PostgreSQL_Schema.sql
└── README.md
```

---

# Current Status

Module 3 has been completed.

The logical database architecture is now finalized and includes:

- Complete table structure
- Primary keys
- Foreign keys
- Business relationships
- ER Diagram
- Naming conventions
- Database documentation
- Architecture decisions

The project is now ready to begin the physical database implementation.

---

# Next Module

## Phase 5 – PostgreSQL Physical Database Schema

Activities:

- Create PostgreSQL DDL
- Define constraints
- Create indexes
- Configure sequences
- Validate schema

---

## Module 4 – Backend Development

Technology Stack:

- Spring Boot
- Spring Data JPA
- PostgreSQL
- REST APIs
- JWT Authentication

---

# Author

Harish Kamat

---

# Last Updated

31-Jul-2026