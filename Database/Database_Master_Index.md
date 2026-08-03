# Database Master Index

---

# Module

**Module 3 – Database Design**

**Status:** ✅ Completed & Frozen (Version 1)

**Version:** 1.1

**Last Updated:** 02-Aug-2026

---

# Purpose

This document serves as the central navigation page for all database-related documentation within the SKCP project.

It provides quick access to:

- Database Tables
- Data Dictionary
- Relationship Summary
- Master ER Diagram
- PostgreSQL Physical Schema
- Seed Data
- Table Reviews
- Naming Standards
- Database README

This is the first document developers should open before working with the SKCP database.

---

# Database Repository Structure

```text
Database/

├── Database_Master_Index.md
├── Database_Data_Dictionary.md
├── Database_Naming_Standards.md
├── Database_Relationship_Summary.md
├── Master_ER_Diagram.md
├── ER_Diagram.png
├── PostgreSQL_Schema.sql
├── Seed_Data.sql
└── README.md
```

---

# Documentation Structure

```text
docs/

└── Database/
    ├── 00_ArchitectObservations
    ├── 01_MasterData
    ├── 02_Procurement
    ├── 03_Production
    ├── 04_Inventory
    ├── 05_Sales
    ├── 06_Finance
    ├── 07_AI
    ├── 08_Reports
    ├── 09_Future
    └── 10_Table-Review
```

---

# Version 1 Business Domains

## 01 – Master Data

- Customer
- Supplier
- Product
- RawMaterial
- Labour
- Asset

---

## 02 – Procurement

- Purchase
- PurchaseItem

---

## 03 – Production

- Production
- Attendance

---

## 04 – Inventory

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

## 05 – Sales

- Order
- OrderItem
- Delivery
- DeliveryItem

---

## 06 – Finance

- Payment
- PaymentAllocation

---

# Version 1 Database Tables

| Domain | Tables |
|---------|--------|
| Master Data | 6 |
| Procurement | 2 |
| Production | 2 |
| Inventory | 3 |
| Sales | 4 |
| Finance | 2 |

Total Tables

**19**

---

# Database Artifacts

Completed:

- ✅ Database Master Index
- ✅ Database Data Dictionary
- ✅ Database Naming Standards
- ✅ Database Relationship Summary
- ✅ Master ER Diagram
- ✅ ER Diagram Image
- ✅ PostgreSQL Physical Schema
- ✅ Seed Data Structure
- ✅ Individual Table Reviews

---

# Table Reviews

Every Version 1 table has an individual review document covering:

- Architecture Review
- Business Purpose
- PostgreSQL Physical Table
- Line-by-Line SQL Explanation
- SQL Syntax
- Database Concepts
- SKCP Business Context
- Validation Checklist
- Architect Approval
- Lesson Summary

Location:

```text
docs/Database/10_Table-Review/
```

---

# Future Tables

The following tables are intentionally deferred to future versions:

- DeliveryConfirmation
- MachineMaintenanceHistory
- WeeklySalary
- ProductionPlanning
- ReservedStock
- WarehouseLocation
- Payroll
- AI Forecast Tables

---

# Current Statistics

| Category | Count |
|----------|------:|
| Business Domains | 6 |
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Version 1 Tables | **19** |
| Total Relationships | **19** |

---

# Current Project Status

| Module | Status |
|--------|--------|
| Module 0 – Environment Setup | ✅ Completed |
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | ✅ Completed & Frozen |
| Module 4 – Spring Boot Backend | 🚀 Starting |
| Module 5 – Frontend Integration | ⏳ Planned |
| Module 6 – AI Features | ⏳ Planned |
| Module 7 – Deployment | ⏳ Planned |

---

# Next Milestone

Module 4 – Spring Boot Backend Development

Upcoming work:

- Spring Boot Project Setup
- PostgreSQL Connection
- JPA Entity Classes
- Entity Relationships
- Repository Layer
- Service Layer
- REST APIs

---

# Architect Verdict

Module 3 is officially complete.

The SKCP database now has:

- Business-first architecture
- Complete logical database design
- Production-ready PostgreSQL schema
- Frozen Version 1 table structure
- Individual table documentation
- Complete relationship documentation

The project is now ready to begin **Module 4 – Spring Boot Backend Development**.