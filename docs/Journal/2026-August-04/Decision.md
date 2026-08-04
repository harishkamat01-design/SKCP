# Decision Log

**Date:** 04 August 2026

**Project:** SKCP (Shree Kundodari Cement Products)

**Module:** Module 4 – Backend Development

**Status:** Supplier CRUD Module Completed

---

# Decisions Made Today

## Decision 1 — Complete Supplier Module Before Starting Product Module

### Decision

The Supplier module was fully completed before beginning the Product module.

### Reason

Completing one module at a time allows proper testing, debugging, documentation, and creates a stable reference implementation for future modules.

---

## Decision 2 — Standardize Backend Architecture Across All Modules

### Decision

Both Customer and Supplier modules now follow exactly the same project structure.

Layers implemented:

- Entity
- Repository
- Service
- Controller

### Reason

Maintaining identical architecture across business modules improves consistency, reduces development time, and simplifies maintenance.

---

## Decision 3 — Upgrade Controllers to Production-Ready REST APIs

### Decision

Both CustomerController and SupplierController were upgraded to use:

- ResponseEntity
- Proper HTTP Status Codes
- Resource existence validation
- RESTful responses

### Reason

Returning proper HTTP responses improves API usability and follows enterprise REST API standards.

---

## Decision 4 — Standardize HTTP Status Codes

### Decision

The project now consistently returns:

- **200 OK** → Successful GET and PUT
- **201 Created** → Successful POST
- **204 No Content** → Successful DELETE
- **404 Not Found** → Resource not found

### Reason

Consistent HTTP responses improve API predictability and align with REST best practices.

---

## Decision 5 — Preserve Immutable Audit Fields

### Decision

The `createdAt` field must never be overwritten during update operations.

The update process now follows:

Fetch Existing Entity

↓

Copy Editable Fields

↓

Preserve Immutable Fields

↓

Save Existing Entity

### Reason

Creation timestamps represent historical audit information and must remain unchanged after record creation.

---

## Decision 6 — Use Java Defaults Alongside Database Defaults

### Decision

Business default values such as:

```java
private String status = "ACTIVE";
```

are initialized within the Java entity even though PostgreSQL also defines a default value.

### Reason

Initializing defaults at the application layer prevents null values before data reaches the database and makes the application more robust.

---

## Decision 7 — Add Defensive Validation During Entity Creation

### Decision

Before persisting a Supplier, the application validates that the status is not null or blank.

Example:

```java
if (this.status == null || this.status.isBlank()) {
    this.status = "ACTIVE";
}
```

### Reason

Never assume incoming data is valid.

Defensive programming reduces runtime errors and protects business data.

---

## Decision 8 — Make Audit Fields Immutable

### Decision

Both Customer and Supplier entities now define:

```java
@Column(nullable = false, updatable = false)
private LocalDateTime createdAt;
```

### Reason

Audit fields should only be created once and must never change during updates.

---

## Decision 9 — Continue Manual API Verification Using Postman

### Decision

Every CRUD endpoint must be manually tested before considering a module complete.

Testing includes:

- Create
- Read
- Read By ID
- Update
- Delete
- Invalid ID Scenarios

### Reason

Manual verification ensures the backend behaves correctly before frontend integration begins.

---

## Decision 10 — Treat Customer Module as the Golden Reference

### Decision

The Customer module remains the reference implementation for all future backend modules.

Supplier was implemented by following the same architecture and standards.

Future modules will reuse this pattern:

- Product
- Raw Material
- Labour
- Asset
- Purchase
- Production
- Inventory
- Orders
- Delivery
- Payment

### Reason

A single proven implementation minimizes architectural drift and accelerates future development.

---

# Summary

Today's work established a reusable backend development standard for the SKCP project.

Major achievements include:

- Supplier CRUD Completed
- Customer Module Upgraded
- Production-Ready REST Controllers
- Standardized HTTP Responses
- Immutable Audit Fields
- Defensive Entity Validation
- Reusable Backend Architecture

The Customer and Supplier modules now serve as the official reference implementation for every remaining backend module.

---

**Decision Recorded By**

Harish Kamat

with ChatGPT