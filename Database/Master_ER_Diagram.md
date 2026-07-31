# Master Entity Relationship Diagram

---

# Module

**Module 3 – Database Design**

**Document:** Master Entity Relationship Diagram

**Version:** 2.0

**Status:** ✅ Module 3 Frozen

**Last Updated:** 31 July 2026

---

# Purpose

This document provides the logical Entity Relationship (ER) view of the SKCP database.

It shows how all business entities are connected through validated foreign key relationships.

This document serves as the blueprint for:

- PostgreSQL Physical Schema
- Spring Boot JPA Entities
- Backend API Design
- Future AI Features

---

# 1. Master Data

```
Customer
Supplier
Product
RawMaterial
Labour
Asset
```

These are the business master tables that own the business identities.

---

# 2. Procurement

```
Supplier
    │
    │ 1:N
    ▼
Purchase
    │
    │ 1:N
    ▼
PurchaseItem
    ▲
    │
    │ N:1
RawMaterial
```

---

# 3. Production

```
Product
    │
    │ 1:N
    ▼
Production
▲        │
│        │
│        ▼
Asset   CuringStock
          ▲
          │
          │
       Product
```

Labour Attendance remains an independent business process.

```
Labour
   │
   │ 1:N
   ▼
Attendance
```

---

# 4. Inventory

```
RawMaterial
      │
      │ 1:1
      ▼
RawMaterialStock

Production
      │
      ▼
CuringStock
      │
      ▼
FinishedGoodsStock
```

---

# 5. Sales

```
Customer
    │
    │ 1:N
    ▼
Order
    │
    ├──────────────┐
    │              │
    ▼              ▼
OrderItem      Delivery
   │              │
   ▼              ▼
Product      DeliveryItem
                 │
                 ▼
              Product
```

---

# 6. Finance

```
Customer
    │
    ▼
Payment
    │
    ▼
PaymentAllocation
        │
        ▼
      Order
```

Payment Allocation resolves the many-to-many relationship between Payments and Orders.

---

# Complete Business Workflow

```
Supplier
      │
      ▼
Purchase
      │
      ▼
PurchaseItem
      │
      ▼
RawMaterialStock
      │
      ▼
Production
      │
      ▼
CuringStock
      │
      ▼
FinishedGoodsStock
      │
      ▼
Customer Order
      │
      ▼
Delivery
      │
      ▼
Payment
      │
      ▼
Payment Allocation
```

---

# Database Statistics

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
| One-to-One | 3 |
| One-to-Many | 16 |
| Total Relationships | **19** |

---

# Architecture Status

| Item | Status |
|------|--------|
| Business Analysis | ✅ Completed |
| Software Architecture | ✅ Completed |
| Database Design | ✅ Completed |
| ER Diagram | ✅ Completed |
| Ready for PostgreSQL Physical Schema | ✅ Yes |

---

# Next Phase

**Phase 5 – PostgreSQL Physical Database Schema**

The validated logical ER model will now be converted into:

- PostgreSQL Tables
- Primary Keys
- Foreign Keys
- Constraints
- Indexes
- SQL Scripts
- Spring Boot Entity Mapping