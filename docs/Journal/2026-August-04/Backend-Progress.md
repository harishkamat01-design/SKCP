# SKCP Daily Progress

**Date:** 04-August-2026

---

# Module

Module 4 – Spring Boot Backend Development

Current Phase:

Supplier Module

Status:

In Progress

---

# Today's Goal

Complete the Supplier backend module using the same architecture as the Customer module and improve both modules to follow production-ready REST API practices.

---

# Completed Today

## Supplier Module Structure

Created the complete Supplier backend structure.

```
com.skcp
│
├── controller
│     └── SupplierController.java
│
├── service
│     └── SupplierService.java
│
├── repository
│     └── SupplierRepository.java
│
└── entity
      └── Supplier.java
```

---

## Repository Layer

Created

SupplierRepository

using

```
JpaRepository<Supplier, Integer>
```

Learned

The Repository layer provides automatic CRUD operations without writing SQL.

Spring Data JPA automatically generates:

- findAll()
- findById()
- save()
- deleteById()

---

## Service Layer

Created

SupplierService

Purpose

Business Logic Layer

Controller

↓

Service

↓

Repository

Business logic remains separated from database operations.

---

## Controller Layer

Created

SupplierController

Configured REST endpoints

GET

```
/api/suppliers
```

GET

```
/api/suppliers/{id}
```

POST

```
/api/suppliers
```

PUT

```
/api/suppliers/{id}
```

DELETE

```
/api/suppliers/{id}
```

---

## Entity Layer Improvements

Completed Supplier Entity.

Implemented:

- @Entity
- @Table
- @Column
- @Id
- @GeneratedValue
- @PrePersist

Added production improvements:

- Default status = ACTIVE
- Immutable createdAt
- Defensive status validation
- Automatic creation timestamp

---

## Customer Module Improvements

Refactored Customer module to match Supplier.

Improved:

- ResponseEntity
- HTTP Status Codes
- Better REST responses
- Immutable createdAt

Both Customer and Supplier modules now follow the same coding standard.

---

# API Testing

Successfully tested every Supplier CRUD API using Postman.

Verified:

## GET

```
GET /api/suppliers
```

Result

```
200 OK
```

---

## POST

Created Supplier successfully.

Verified insertion into PostgreSQL.

---

## GET By ID

Successfully retrieved Supplier using ID.

Verified:

- Existing Supplier
- Invalid Supplier

---

## PUT

Successfully updated Supplier.

Verified:

- Name
- Phone
- WhatsApp
- Address

Issue Found:

createdAt became NULL during update.

Root Cause:

Entire Supplier object replaced the existing database entity.

Solution:

Preserved immutable fields before saving.

Result:

createdAt now remains unchanged during updates.

---

## DELETE

Successfully deleted Supplier.

Result

```
204 No Content
```

---

## Invalid DELETE

Deleting a non-existing Supplier returned

```
404 Not Found
```

Verified that the REST API correctly handles missing resources.

---

# Build Verification

Successfully executed

```
mvn clean

mvn compile

mvn package

mvn spring-boot:run
```

Backend started successfully.

Verified:

```
http://localhost:8080
```

```
http://localhost:8080/api/suppliers
```

Backend and PostgreSQL integration working correctly.

---

# Biggest Learning Today

Today I learned how to build production-ready REST APIs instead of only working CRUD APIs.

Major improvements include:

- ResponseEntity
- HTTP Status Codes
- Immutable audit fields
- Defensive programming
- Better REST design
- Update existing entity instead of replacing it

I also learned that production software focuses on protecting business data, not just making code work.

---

# Challenges Faced

### createdAt became NULL during PUT

Cause

Updating the incoming object directly replaced immutable fields.

Solution

Used:

Fetch Existing Entity

↓

Copy Editable Fields

↓

Preserve createdAt

↓

Save Existing Entity

This pattern is now the standard update strategy for all future modules.

---

# Design Improvements Learned Today

Implemented several enterprise-quality improvements.

- Java-side default values
- Immutable audit fields
- Defensive validation
- Better lifecycle method naming
- ResponseEntity
- Standard HTTP status codes

These improvements increase software reliability and maintainability.

---

# Key Achievement

Successfully completed the Supplier backend module.

Current completed backend modules:

- Customer
- Supplier

Both modules now use the same reusable enterprise architecture and have fully tested CRUD APIs.

---

# Next Step

Continue Module 4.

Next implementation:

- Product Module

Followed by:

- Raw Material Module
- Labour Module
- Asset Module

Later:

- Purchase
- Production
- Inventory
- Orders
- Delivery
- Payments

---

# Current Backend Progress

| Module | Status |
|---------|--------|
| Customer Module | ✅ Completed |
| Supplier Module | ✅ Completed |
| Product Module | ⏳ Next |
| Raw Material Module | ⏳ Pending |
| Purchase Module | ⏳ Pending |
| Production Module | ⏳ Pending |
| Inventory Module | ⏳ Pending |
| Sales Module | ⏳ Pending |
| Finance Module | ⏳ Pending |