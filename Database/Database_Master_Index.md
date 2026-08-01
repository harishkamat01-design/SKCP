# Database Master Index

# Module

**Module 3 – Database Design**

**Status:** ✅ Completed (Frozen – Version 1)

**Version:** 1.0

**Last Updated:** 30-Jul-2026

---

# Purpose

This document serves as the central navigation page for all database-related documentation within the SKCP project.

It provides quick access to:

- Database Tables
- Data Dictionary
- Relationship Summary
- Master ER Diagram
- Naming Standards
- PostgreSQL Physical Schema
- Database README


---

# Database Repository Structure

```text
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

# Database Modules

## Master Data

- Asset
- Customer
- Labour
- Product
- RawMaterial
- Supplier

---

## Procurement

- Purchase
- PurchaseItem

---

## Inventory

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

---

## Production

- Production
- Attendance

---

## Sales

- Order
- OrderItem
- Delivery
- DeliveryItem

---

## Finance

- Payment
- PaymentAllocation

---

# Future Tables

The following tables are intentionally deferred to future versions:

- DeliveryConfirmation
- MachineMaintenanceHistory
- WeeklySalary
- ProductionPlanning

---

# Database Artifacts

- Database Data Dictionary
- Database Naming Standards
- Database Relationship Summary
- Master ER Diagram
- PostgreSQL Physical Schema (Future)

---

# Current Statistics

| Category | Count |
|----------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Version 1 Tables | **19** |

---

# Current Project Status

| Module | Status |
|--------|--------|
| Module 0 – Environment Setup | ✅ Completed |
| Module 1 – Business Analysis | ✅ Completed |
| Module 2 – Software Architecture | ✅ Completed |
| Module 3 – Database Design | 🚧 Final Review |
| Module 4 – Backend Development | ⏳ Planned |

---

# Next Milestone

Complete the final validation of the database by:

- Preparing the PostgreSQL physical schema
- Freezing Module 3

Once these activities are complete, SKCP will transition to **Module 4 – Backend Development (Spring Boot + PostgreSQL).**


---

