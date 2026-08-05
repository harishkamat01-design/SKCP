# Decision Log

**Date:** 05 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Status:** Procurement, Attendance & Master Data Backend Completed

---

# Decisions Made Today

---

## Decision 1 — Adopt Entity Relationships Instead of Foreign Key Variables

### Decision

Whenever a table contains a foreign key, the Entity will store the complete parent object instead of only the foreign key ID.

Example

Instead of

```java
private Integer labourId;
```

use

```java
@ManyToOne
@JoinColumn(name = "labour_id")
private Labour labour;
```

### Reason

This allows Hibernate to automatically manage relationships and simplifies future development.

Benefits

- Automatic JOIN operations
- Cleaner object model
- Easier DTO implementation
- Better frontend integration
- Industry standard JPA design

---

## Decision 2 — Business Rules Belong in Service Layer

### Decision

Controllers must never calculate business values.

Business rules will always be implemented inside the Service layer.

### Reason

The Service layer is responsible for maintaining business integrity.

Example

Attendance

Instead of accepting

```text
dailyRate

dailyAmount
```

from the frontend,

AttendanceService now performs

```
Read Labour
        ↓
Get Daily Rate
        ↓
Calculate Daily Amount
```

This prevents invalid business data.

---

## Decision 3 — Frontend Must Never Decide Business Values

### Decision

Values that already exist in parent tables should never be sent by the frontend.

### Reason

The frontend should only identify the selected business object.

Example

Attendance

Frontend sends

```json
{
    "labour": {
        "labourId": 1
    }
}
```

The backend determines

- Labour Details
- Daily Rate
- Daily Amount

This guarantees consistency.

---

## Decision 4 — Purchase Item Will Store Relationships, Not IDs

### Decision

PurchaseItem Entity will store

```java
private Purchase purchase;

private RawMaterial rawMaterial;
```

instead of

```java
Integer purchaseId;

Integer rawMaterialId;
```

### Reason

PurchaseItem represents a business relationship, not merely two integers.

This keeps the object model aligned with the database architecture.

---

## Decision 5 — Parent Tables Remain the Single Source of Truth

### Decision

Master Data tables own their business information.

Transaction tables reference them.

### Reason

Business information should exist in only one place.

Examples

```
Supplier
        ↓
Purchase

Labour
        ↓
Attendance

Purchase
        ↓
Purchase Item

Raw Material
        ↓
Purchase Item
```

This eliminates duplicate business data.

---

## Decision 6 — Keep Controllers Thin

### Decision

Controllers should only

- Receive requests
- Validate existence
- Call Services
- Return ResponseEntity

Controllers should never contain business logic.

### Reason

This follows enterprise layered architecture.

```
Controller

↓

Service

↓

Repository

↓

Database
```

---

## Decision 7 — Preserve Immutable Fields During Updates

### Decision

During PUT operations,

the following fields must never be overwritten

```
Primary Keys

createdAt
```

Only editable business fields are updated.

### Reason

Audit information must remain unchanged throughout the record lifecycle.

---

## Decision 8 — CRUD Pattern is Now Standardized

### Decision

Every backend module will follow the same implementation pattern.

```
Entity

↓

Repository

↓

Service

↓

Controller

↓

CRUD Testing

↓

Documentation
```

### Reason

Consistency significantly improves maintainability and reduces future development effort.

---

## Decision 9 — DTO Layer Will Be Introduced Later

### Decision

Current development will continue using Entities.

DTO implementation will be introduced after backend business modules are completed.

### Reason

The immediate objective is to establish correct business logic.

DTOs will later improve

- API responses
- Frontend payloads
- Serialization
- Performance
- Security

---

## Decision 10 — Complete Business Domains Together

### Decision

Instead of finishing every Master Data module first,

related Transaction modules can be completed together.

Example

```
Supplier

↓

Purchase

↓

Purchase Item
```

### Reason

Building complete business workflows improves understanding of how entities interact in a real ERP system.

---

## Decision 11 — Asset Remains an Independent Master Entity

### Decision

Asset currently has no parent or child relationships.

Future versions will connect Asset with

- Maintenance
- Repairs
- Production
- Machine History

### Reason

Version 1 focuses only on Asset Master Data.

---

## Decision 12 — PostgreSQL Remains the Single Validation Source

### Decision

Every CRUD operation must be validated using pgAdmin in addition to Postman.

### Reason

Successful API responses do not always guarantee successful database persistence.

Verification in PostgreSQL confirms

- Data Integrity
- Relationships
- Constraints
- Stored Values

---

# Summary

Today's work established the architectural standards that will govern the remainder of the SKCP backend.

Major architectural decisions include:

- Parent–Child relationships using JPA Entities
- Business logic centralized in Services
- Master Data as the single source of truth
- Standardized CRUD implementation
- Controller simplification
- Future DTO strategy
- Enterprise layered architecture
- PostgreSQL validation as mandatory

These decisions significantly improved the quality, maintainability, and scalability of the SKCP backend.

---

**Decision Recorded By**

**Harish Kamat**

with ChatGPT