# Raw Material Module – Complete Learning Notes

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Feature:** Raw Material CRUD Module

**Status:** ✅ Completed

---

# Objective

Implement the Raw Material backend module using the same production-ready architecture established for the Customer, Supplier, and Product modules.

The objective was to:

- Build a reusable CRUD backend module.
- Follow enterprise Spring Boot architecture.
- Connect Spring Boot with PostgreSQL.
- Test every API using Postman.
- Learn production-ready update practices.

---

# Module Structure

The Raw Material module follows the standard layered architecture.

```
Client (Postman)
        │
        ▼
RawMaterialController
        │
        ▼
RawMaterialService
        │
        ▼
RawMaterialRepository
        │
        ▼
Hibernate (JPA)
        │
        ▼
PostgreSQL
```

---

# Database Table

```sql
CREATE TABLE raw_material
(
    raw_material_id SERIAL PRIMARY KEY,

    material_name VARCHAR(100) NOT NULL,

    material_category VARCHAR(50) NOT NULL,

    description TEXT,

    status VARCHAR(10)
        NOT NULL
        DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);
```

Purpose:

Stores the master list of all raw materials used during production.

Examples:

- Cement
- M-Sand
- Stone Dust
- Fly Ash
- Water

---

# Files Created

## Entity

RawMaterial.java

Responsibilities:

- Maps Java object to PostgreSQL table.
- Defines table columns.
- Generates Primary Key.
- Automatically sets createdAt.

Key annotations:

- @Entity
- @Table
- @Id
- @GeneratedValue
- @Column
- @PrePersist

---

## Repository

RawMaterialRepository.java

```java
extends JpaRepository<RawMaterial, Integer>
```

Responsibilities:

- Database access.
- No SQL required for CRUD.

Automatically provides:

- save()
- findAll()
- findById()
- deleteById()
- existsById()

---

## Service

RawMaterialService.java

Responsibilities:

Business logic layer.

Methods:

- getAllRawMaterials()
- getRawMaterialById()
- saveRawMaterial()
- deleteRawMaterial()

---

## Controller

RawMaterialController.java

REST Endpoints:

| Method | Endpoint |
|---------|----------|
| GET | /api/raw-materials |
| GET | /api/raw-materials/{id} |
| POST | /api/raw-materials |
| PUT | /api/raw-materials/{id} |
| DELETE | /api/raw-materials/{id} |

Uses:

- ResponseEntity
- Proper HTTP Status Codes
- Constructor Injection

---

# API Testing

## GET All

```
GET
/api/raw-materials
```

Expected

```
200 OK
```

Initially returned

```
[]
```

---

## POST

Request

```json
{
  "materialName": "Cement",
  "materialCategory": "Binding Material",
  "description": "OPC 53 Grade Cement",
  "status": "ACTIVE"
}
```

Response

```json
{
  "rawMaterialId": 1,
  "materialName": "Cement",
  "materialCategory": "Binding Material",
  "description": "OPC 53 Grade Cement",
  "status": "ACTIVE",
  "createdAt": "..."
}
```

Status

```
201 Created
```

---

## GET By ID

```
GET
/api/raw-materials/1
```

Status

```
200 OK
```

---

## PUT

Successfully updated:

- Material Name
- Material Category
- Description
- Status

Verified:

createdAt remained unchanged.

---

## DELETE

Successfully deleted demo record.

Verified:

```
204 No Content
```

Also verified

```
404 Not Found
```

for invalid IDs.

---

# Important Bug Fixed

## Problem

During UPDATE,

createdAt became

```
null
```

---

## Root Cause

The controller created a new object.

```java
rawMaterial.setRawMaterialId(id);

save(rawMaterial);
```

The new object did not contain the original createdAt value.

Hibernate therefore overwrote it.

---

## Solution

Instead of saving the incoming object,

retrieve the existing entity first.

```java
RawMaterial existingRawMaterial =
rawMaterialService.getRawMaterialById(id);
```

Update only editable fields.

```java
existingRawMaterial.setMaterialName(...);

existingRawMaterial.setMaterialCategory(...);

existingRawMaterial.setDescription(...);

existingRawMaterial.setStatus(...);
```

Then save

```java
save(existingRawMaterial);
```

Result

createdAt remains preserved.

---

# Design Improvement Learned

## Wrong Approach

```java
save(rawMaterial);
```

Problem

- createdAt becomes null
- relationships may break
- audit fields may be lost

---

## Correct Approach

Fetch existing entity

↓

Update editable fields only

↓

Save existing entity

Benefits

- Audit fields preserved
- Future relationships protected
- Hibernate works with managed entities
- Production-ready design

---

# REST URL Naming Convention

Learned that every layer uses a different naming standard.

| Layer | Convention | Example |
|--------|------------|----------|
| Database | snake_case | raw_material |
| Entity | PascalCase | RawMaterial |
| Variable | camelCase | rawMaterial |
| REST API | kebab-case | /api/raw-materials |

Reason

REST APIs typically use kebab-case because URLs are easier to read and follow industry standards.

---

# HTTP Status Codes Used

| Status | Meaning |
|----------|---------|
| 200 OK | Successful GET / PUT |
| 201 Created | Successful POST |
| 204 No Content | Successful DELETE |
| 404 Not Found | Resource does not exist |

---

# Architecture Reinforced

```
Postman

↓

Controller

↓

Service

↓

Repository

↓

Hibernate

↓

PostgreSQL

↓

Database Response

↓

Controller

↓

Postman
```

---

# Skills Strengthened

- Spring Boot
- REST APIs
- JPA
- Hibernate
- PostgreSQL
- CRUD Development
- ResponseEntity
- HTTP Status Codes
- Controller Design
- Repository Pattern
- Service Layer
- Postman Testing
- Production-ready Update Pattern

---

# Reusable Pattern Established

The same architecture will now be reused for:

- Labour
- Asset
- Purchase
- Purchase Item
- Attendance
- Production
- RawMaterialStock
- CuringStock
- FinishedGoodsStock
- Order
- OrderItem
- Delivery
- DeliveryItem
- Payment
- PaymentAllocation

---

# Biggest Takeaway

A production-ready UPDATE operation should never directly save the incoming request object.

Instead,

1. Fetch existing entity.
2. Update editable fields.
3. Save the managed entity.

This preserves audit information, avoids accidental data loss, and follows enterprise Spring Boot best practices.

---

**Prepared By**

Harish Kamat

with ChatGPT