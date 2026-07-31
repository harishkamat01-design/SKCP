# Database Data Dictionary

---

## Purpose

The Database Data Dictionary provides a high-level catalog of every database table used in SKCP.

It serves as the first reference point before reading detailed table documentation.

---

# Database Tables

| Table | Category | Purpose |
|--------|----------|----------|
| Asset | Master | Stores factory assets, machines, vehicles, utilities and equipment |
| Customer | Master | Stores customer information |
| Labour | Master | Stores labour master information |
| Product | Master | Stores finished product catalog |
| RawMaterial | Master | Stores raw material master information |
| Supplier | Master | Stores supplier information |
| Purchase | Transaction | Purchase invoice header |
| PurchaseItem | Transaction | Purchased raw material details |
| Production | Transaction | Daily production record |
| Attendance | Transaction | Daily labour attendance |
| Order | Transaction | Customer order header |
| OrderItem | Transaction | Ordered product details |
| Delivery | Transaction | Delivery header |
| DeliveryItem | Transaction | Delivered product details |
| Payment | Transaction | Customer payment transactions |
| PaymentAllocation | Transaction | Allocates payments to customer orders |
| RawMaterialStock | Inventory | Current stock of raw materials |
| CuringStock | Inventory | Current curing yard stock |
| FinishedGoodsStock | Inventory | Current finished goods stock |

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

# Statistics

| Category | Count |
|----------|------:|
| Master Tables | 6 |
| Transaction Tables | 10 |
| Inventory Tables | 3 |
| Total Version 1 Tables | 19 |

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
| Status | ✅ Active |
| Last Updated | 30-Jul-2026 |
| Author | Harish Kamat |


---

# OLD version of Database Data Dictionary

---

| Table | Category | Purpose |
|--------|----------|----------|
| Supplier | Master | Stores supplier information |
| RawMaterial | Master | Stores raw material master |
| Purchase | Transaction | Purchase header |
| PurchaseItem | Transaction | Purchased material details |
| Customer | Master | Customer information |
| Product | Master | Product catalog |
| Production | Transaction | Production header |
| ProductionItem | Transaction | Production details |
| Curing | Transaction | Curing process tracking |
| FinishedGoodsStock | Inventory | Available finished goods |
| Order | Transaction | Customer order |
| OrderItem | Transaction | Ordered products |
| Delivery | Transaction | Delivery header |
| DeliveryItem | Transaction | Delivered products |
| DeliveryConfirmation | Transaction | Delivery acknowledgment |
| Payment | Transaction | Customer payments |
| PaymentAllocation | Transaction | Allocates payment to orders |

---

# Statistics

Master Tables : 4

Transaction Tables : 12

Inventory Tables : 1

Total Tables : 16