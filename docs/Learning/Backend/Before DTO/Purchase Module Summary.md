# Purchase Module Summary

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Backend Development

**Entity:** Purchase

**Status:** ✅ CRUD Completed Successfully

**Date Completed:** 05 August 2026

---

# Objective

The Purchase module records every purchase transaction made from suppliers.

Each purchase belongs to exactly one supplier.

This module acts as the **Purchase Header** in the future Header–Detail relationship.

---

# Database Table

```sql
purchase
```

Primary Key

```
purchase_id
```

Foreign Key

```
supplier_id
```

References

```
supplier(supplier_id)
```

---

# Files Created

```
Purchase.java
PurchaseRepository.java
PurchaseService.java
PurchaseController.java
```

---

# Spring Boot Layered Architecture

```
Postman / Frontend

        │

        ▼

PurchaseController

        │

        ▼

PurchaseService

        │

        ▼

PurchaseRepository

        │

        ▼

Hibernate (JPA)

        │

        ▼

PostgreSQL
```

---

# CRUD APIs Implemented

## Create Purchase

```
POST
/api/purchases
```

Status

```
201 CREATED
```

---

## Get All Purchases

```
GET
/api/purchases
```

Status

```
200 OK
```

---

## Get Purchase By ID

```
GET
/api/purchases/{id}
```

Status

```
200 OK
404 NOT FOUND
```

---

## Update Purchase

```
PUT
/api/purchases/{id}
```

Status

```
200 OK
404 NOT FOUND
```

---

## Delete Purchase

```
DELETE
/api/purchases/{id}
```

Status

```
204 NO CONTENT
404 NOT FOUND
```

---

# Parent–Child Relationship

Purchase is **not** an independent table.

It belongs to a Supplier.

Relationship

```
Supplier (Parent)

        │

        │ One Supplier

        │

        ▼

Purchase (Child)

Many Purchases
```

Database Relationship

```
purchase.supplier_id

↓

supplier.supplier_id
```

---

# How Purchase is Created

Client sends

```json
{
    "supplier": {
        "supplierId": 1
    },
    "purchaseDate": "2026-08-05",
    "invoiceNumber": "INV-1001",
    "totalAmount": 15000.00,
    "paymentStatus": "PENDING",
    "remarks": "First purchase from supplier",
    "status": "ACTIVE"
}
```

Hibernate stores

```
supplier_id = 1
```

inside Purchase table.

---

# PostgreSQL Verification

Verified successfully using pgAdmin.

Confirmed operations

- Insert
- Read
- Update
- Delete

Database integrity confirmed.

---

# Current Design

Currently

```
Purchase

↓

Supplier ID only
```

is sufficient for persistence.

The API response currently returns

```json
"supplier": {
    "supplierId": 1,
    "supplierName": null,
    "phone": null,
    "gstNumber": null
}
```

This is expected because the client only sends

```
supplierId
```

and Hibernate does not automatically fetch the remaining Supplier details.

---

# Important Architectural Note

Current implementation temporarily allows

```java
existingPurchase.setTotalAmount(purchase.getTotalAmount());
```

This is acceptable because the Purchase Item module has not yet been developed.

---

# Future Refactoring Plan

Immediately after Purchase CRUD completion, the next module will be

```
Purchase Item
```

After Purchase Item is implemented,

the backend architecture will change.

Current

```
Frontend

↓

totalAmount

↓

Purchase
```

Future

```
Purchase Items

↓

Quantity × Rate

↓

Item Amount

↓

Sum All Items

↓

Purchase Total

↓

Save Purchase
```

At that stage

```
totalAmount
```

will be calculated only inside the Service layer.

The frontend will never send it.

---

# Enterprise Architecture Roadmap

Current Progress

```
Master CRUD

Customer
Supplier
Product
Raw Material
Labour
Purchase
```

Next

```
Header–Detail Transactions

Purchase
      │
      ▼
Purchase Item
```

Later

```
Inventory

Production

Orders

Payments

Delivery
```

---

# Lessons Learned

## 1. Parent–Child Relationships

Purchase is the first business transaction linked to another master table.

The relationship is

```
Supplier

↓

Purchase
```

---

## 2. Foreign Keys Store IDs

The database stores only

```
supplier_id
```

not the complete Supplier record.

---

## 3. Hibernate Saves References

The request only needs

```json
{
    "supplierId": 1
}
```

Hibernate uses this ID to create the relationship.

---

## 4. API Response vs Database

Database

```
Stores supplier_id only.
```

API

```
Currently returns the object supplied by the client.
```

Later,

DTOs and Service logic will fetch complete Supplier information.

---

## 5. DTO Phase

After all CRUD modules are completed,

the backend will enter a dedicated refactoring phase.

During that phase

- DTOs
- Optimized Responses
- Business Logic
- Parent Fetching
- Service Refactoring

will be implemented consistently across SKCP.

---

# Module Completion

Completed

- Entity
- Repository
- Service
- Controller
- CRUD APIs
- PostgreSQL Validation
- Parent–Child Mapping
- Foreign Key Validation
- API Testing
- pgAdmin Verification

---

# Next Module

```
Purchase Item
```

This module will introduce the Header–Detail transaction pattern and automatic purchase total calculation.

---

**Prepared By**

Harish Kamat

with ChatGPT