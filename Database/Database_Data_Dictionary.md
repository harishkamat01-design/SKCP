# Database Data Dictionary

---

## Purpose

The Database Data Dictionary is the official catalog of all **Version 1 SKCP PostgreSQL database tables**.

It acts as the primary reference for understanding:

- Database tables
- Table classification
- Business ownership
- Business domains
- Table responsibilities
- Database scope

This document should always be reviewed before reading:

- Database Relationship Summary
- Master ER Diagram
- PostgreSQL Physical Schema
- Spring Boot Entity Classes
- Backend Repository Design

---

# Version 1 Database Tables

| Table | Domain | Category | Purpose |
|---------|----------|------------|------------------------------------------------|
| Asset | Master Data | Master | Factory assets, machines, vehicles, utilities and equipment |
| Customer | Master Data | Master | Customer master information |
| Labour | Master Data | Master | Labour master information |
| Product | Master Data | Master | Finished product catalog |
| RawMaterial | Master Data | Master | Raw material master information |
| Supplier | Master Data | Master | Supplier master information |
| Purchase | Procurement | Transaction | Purchase transaction header |
| PurchaseItem | Procurement | Transaction | Purchased raw material details |
| Production | Production | Transaction | Daily production record |
| Attendance | Production | Transaction | Labour attendance |
| RawMaterialStock | Inventory | Current Position | Current raw material inventory |
| CuringStock | Inventory | Current Position | Blocks currently curing |
| FinishedGoodsStock | Inventory | Current Position | Current saleable finished goods |
| Order | Sales | Transaction | Customer order header |
| OrderItem | Sales | Transaction | Ordered product details |
| Delivery | Sales | Transaction | Delivery transaction header |
| DeliveryItem | Sales | Transaction | Delivered product details |
| Payment | Finance | Transaction | Customer payment transaction |
| PaymentAllocation | Finance | Transaction | Payment allocation against orders |

---

# Business Domain Summary

SKCP Version 1 database is organized into six business domains.

| Domain | Responsibility |
|---------|----------------|
| Master Data | Permanent business information |
| Procurement | Raw material purchasing |
| Production | Manufacturing operations |
| Inventory | Current stock positions |
| Sales | Customer orders and deliveries |
| Finance | Customer payments |

---

# Master Data Tables

These tables store permanent business information.

- Customer
- Supplier
- Product
- RawMaterial
- Labour
- Asset

Master tables rarely change and are referenced by transaction tables.

---

# Transaction Tables

These tables record business events.

Procurement

- Purchase
- PurchaseItem

Production

- Production
- Attendance

Sales

- Order
- OrderItem
- Delivery
- DeliveryItem

Finance

- Payment
- PaymentAllocation

Every transaction represents an actual business event.

---

# Inventory Tables

Inventory tables always represent the **current stock position**.

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

Historical stock movement is maintained through transaction tables.

---

# Inventory Philosophy

SKCP follows the ERP principle:

Current Position

- RawMaterialStock
- CuringStock
- FinishedGoodsStock

Historical Transactions

- Purchase
- Production
- Delivery

This avoids repeatedly calculating stock and improves reporting performance.

---

# Business Flow

Supplier

↓

Purchase

↓

RawMaterialStock

↓

Production

↓

CuringStock

↓

FinishedGoodsStock

↓

Order

↓

Delivery

↓

Payment

↓

Business Insights

---

# Statistics

| Category | Count |
|----------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Tables | 19 |

---

# Relationship Statistics

| Relationship | Count |
|--------------|------:|
| One-to-Many | 16 |
| One-to-One | 3 |
| Total Relationships | 19 |

---

# Documentation Available

Module 3 now contains:

- Database Data Dictionary
- Database Master Index
- Database Naming Standards
- Database Relationship Summary
- Master ER Diagram
- PostgreSQL Schema
- Seed Data
- Individual Table Reviews
- README

---

# Future Tables (Deferred)

These tables are intentionally excluded from Version 1.

| Table | Planned Version | Purpose |
|---------|-----------------|-------------------------------|
| DeliveryConfirmation | Version 2 | Proof of Delivery |
| MachineMaintenanceHistory | Future | Machine maintenance records |
| WeeklySalary | Future | Payroll processing |
| ProductionPlanning | Future | Production scheduling |
| ReservedStock | Future | Order reservation |
| WarehouseLocation | Future | Multi-location inventory |

---

# Database Philosophy

SKCP follows a Business-First Architecture.

Business

↓

Master Data

↓

Transactions

↓

Inventory

↓

Reports

↓

AI

Every table exists because it represents either:

- A Business Object
- A Business Event
- A Current Business Position

No unnecessary tables exist.

---

# Current Status

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

The Version 1 database architecture is complete.

All 19 PostgreSQL tables have been:

- Business validated
- Architect reviewed
- Physically designed
- Documented
- Frozen

The database is now ready for:

- Spring Boot Entity Classes
- JPA Relationships
- Repository Layer
- Service Layer
- REST APIs

Module 3 is officially complete.