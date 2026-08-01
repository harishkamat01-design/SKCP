# Database Data Dictionary


## Purpose

The Database Data Dictionary provides the official catalog of all Version 1 SKCP database entities.

It acts as the entry point for understanding:

- Database tables
- Table classification
- Business ownership
- Domain responsibility
- Database scope

Detailed table structures, relationships, and business rules are documented separately.

This document is the first reference before reviewing:

- Database Relationship Summary
- Master ER Diagram
- PostgreSQL Physical Schema
- Backend Entity Design

---

# Database Tables

    | Table | Domain | Category | Purpose |
    |-|-|-|-|
    | Asset | Master Data | Master | Factory assets, machines, vehicles, utilities and equipment |
    | Customer | Master Data | Master | Customer information |
    | Labour | Master Data | Master | Labour information |
    | Product | Master Data | Master | Finished product catalog |
    | RawMaterial | Master Data | Master | Raw material information |
    | Supplier | Master Data | Master | Supplier information |
    | Purchase | Procurement | Transaction | Purchase invoice header |
    | PurchaseItem | Procurement | Transaction | Purchased raw material details |
    | Production | Production | Transaction | Daily manufacturing record |
    | Attendance | Production | Transaction | Daily labour attendance |
    | RawMaterialStock | Inventory | Transaction | Current raw material stock |
    | CuringStock | Inventory | Transaction | Blocks under curing |
    | FinishedGoodsStock | Inventory | Transaction | Saleable finished products |
    | Order | Sales | Transaction | Customer order header |
    | OrderItem | Sales | Transaction | Ordered product details |
    | Delivery | Sales | Transaction | Delivery transaction header |
    | DeliveryItem | Sales | Transaction | Delivered product details |
    | Payment | Finance | Transaction | Customer payment transaction |
    | PaymentAllocation | Finance | Transaction | Payment allocation against orders |

---

# Future Tables

The following tables have been intentionally deferred to future versions.

| Table | Planned Version | Purpose |
|--------|-----------------|----------|
| DeliveryConfirmation | Version 2 | Delivery acknowledgement and Proof of Delivery |
| MachineMaintenanceHistory | Future | Detailed maintenance history |
| WeeklySalary | Future | Salary processing |
| ProductionPlanning | Future | Production scheduling |

---

# Business Domain Summary

SKCP Version 1 database is organized into six business domains.

| Domain | Responsibility |
|---------|---------------|
| Master Data | Stores stable business identities |
| Procurement | Manages supplier purchases and raw material acquisition |
| Production | Manages manufacturing activities and workforce tracking |
| Inventory | Manages current stock positions |
| Sales | Manages customer orders and deliveries |
| Finance | Manages payments and outstanding balances |

---

# Inventory Lifecycle Principle

SKCP separates:

Historical Transactions

↓
Purchase
Production
Delivery


Current Inventory Position

↓
RawMaterialStock
CuringStock
FinishedGoodsStock


This prevents repeated calculation of stock balances and improves system performance.

---

# Statistics

| Category | Count |
|----------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Version 1 Tables | 19 |
---

# Relationship Statistics

| Relationship Type | Count |
|---|---:|
| One-to-Many Relationships | 16 |
| One-to-One Relationships | 3 |
| Total Validated Relationships | 19 |

---

## Database Philosophy

The SKCP database follows a Business-First design.

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

Each table exists because it represents a real business object or business event.

No table is created unless it reflects an actual business process.

---

## Status

| Item | Status |
|------|--------|
| Module | Module 3 – Database Design |
| Version | 1.0 |
| Status | ✅ Approved for Phase 5 |
| Last Updated | 31-Jul-2026 |
| Author | Harish Kamat |

---
